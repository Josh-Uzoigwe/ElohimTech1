import { Request, Response } from 'express';
import { Product, Unit } from '../models';

// Get all products with optional filters
export const getProducts = async (req: Request, res: Response) => {
    try {
        const { brand, category, minPrice, maxPrice, availability } = req.query;

        const filter: any = {};

        if (brand) filter.brand = brand;
        if (category) filter.category = category;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });

        // Get unit counts for each product
        const productsWithUnits = await Promise.all(
            products.map(async (product) => {
                const units = await Unit.find({ productId: product._id });
                const availableCount = units.filter(u => u.status === 'available').length;
                const comingSoonCount = units.filter(u => u.status === 'coming_soon').length;

                return {
                    ...product.toObject(),
                    unitCounts: {
                        total: units.length,
                        available: availableCount,
                        comingSoon: comingSoonCount,
                        taken: units.length - availableCount - comingSoonCount,
                    },
                };
            })
        );

        res.json(productsWithUnits);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single product with its units
export const getProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const units = await Unit.find({ productId: product._id });

        res.json({
            ...product.toObject(),
            units: units.map(u => ({
                id: u._id,
                tag: u.uniqueTag,
                status: u.status,
            })),
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create new product (Admin only)
export const createProduct = async (req: Request, res: Response) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update product (Admin only)
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete product (Admin only)
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Also delete associated units
        await Unit.deleteMany({ productId: product._id });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get featured products
export const getFeaturedProducts = async (_req: Request, res: Response) => {
    try {
        const products = await Product.find({ featured: true }).limit(6);
        res.json(products);
    } catch (error) {
        console.error('Get featured products error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
