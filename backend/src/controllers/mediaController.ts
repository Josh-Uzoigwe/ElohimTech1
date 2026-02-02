import { v2 as cloudinary } from 'cloudinary';
import { Request, Response } from 'express';
import multer from 'multer';
import { Product } from '../models';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer memory storage for handling file uploads
const storage = multer.memoryStorage();
export const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image and video files are allowed'));
        }
    }
});

// Upload media to Cloudinary
export const uploadMedia = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { productId, mediaType } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Upload to Cloudinary
        const result = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'elohimtech',
                    resource_type: mediaType === 'video' ? 'video' : 'image',
                    transformation: mediaType === 'video'
                        ? [{ quality: 'auto' }]
                        : [{ width: 1200, height: 900, crop: 'limit', quality: 'auto' }],
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file!.buffer);
        });

        // Update product with new media URL
        const product = await Product.findById(productId);
        if (!product) {
            // Delete uploaded file if product not found
            await cloudinary.uploader.destroy(result.public_id);
            return res.status(404).json({ message: 'Product not found' });
        }

        if (mediaType === 'video') {
            product.media.videos.push(result.secure_url);
        } else {
            product.media.images.push(result.secure_url);
        }

        await product.save();

        res.status(201).json({
            message: 'Media uploaded successfully',
            url: result.secure_url,
            publicId: result.public_id,
            mediaType: mediaType || 'image',
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Failed to upload media' });
    }
};

// Delete media from Cloudinary
export const deleteMedia = async (req: Request, res: Response) => {
    try {
        const { productId, url, mediaType } = req.body;

        if (!productId || !url) {
            return res.status(400).json({ message: 'Product ID and URL are required' });
        }

        // Extract public ID from URL
        const urlParts = url.split('/');
        const filenameWithExt = urlParts[urlParts.length - 1];
        const publicId = `elohimtech/${filenameWithExt.split('.')[0]}`;

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(publicId, {
            resource_type: mediaType === 'video' ? 'video' : 'image',
        });

        // Remove from product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (mediaType === 'video') {
            product.media.videos = product.media.videos.filter(v => v !== url);
        } else {
            product.media.images = product.media.images.filter(i => i !== url);
        }

        await product.save();

        res.json({ message: 'Media deleted successfully' });
    } catch (error) {
        console.error('Delete media error:', error);
        res.status(500).json({ message: 'Failed to delete media' });
    }
};

// Get all media for a product
export const getProductMedia = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({
            productId: product._id,
            productName: product.name,
            images: product.media.images,
            videos: product.media.videos,
        });
    } catch (error) {
        console.error('Get media error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
