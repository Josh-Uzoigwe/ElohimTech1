'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Upload,
    Image as ImageIcon,
    Video,
    X,
    Trash2,
    Check,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { productsApi, mediaApi } from '@/lib/api';
import styles from './page.module.css';

interface Product {
    _id: string;
    name: string;
    brand: string;
    media: { images: string[]; videos: string[] };
}

export default function MediaUploadPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
    const [dragOver, setDragOver] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin');
            return;
        }
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await productsApi.getAll();
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = async (files: FileList | null) => {
        if (!files || !selectedProduct) return;

        setUploading(true);
        setUploadProgress(0);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const isVideo = file.type.startsWith('video/');

            try {
                await mediaApi.upload(selectedProduct._id, file, isVideo ? 'video' : 'image');
                setUploadProgress(((i + 1) / files.length) * 100);
            } catch (error) {
                console.error('Upload failed:', error);
            }
        }

        // Refresh product data
        await refreshProductMedia();
        setUploading(false);
        setUploadProgress(0);
    };

    const refreshProductMedia = async () => {
        if (!selectedProduct) return;
        try {
            const response = await mediaApi.getProductMedia(selectedProduct._id);
            setSelectedProduct(prev => prev ? {
                ...prev,
                media: {
                    images: response.data.images,
                    videos: response.data.videos
                }
            } : null);
        } catch (error) {
            console.error('Failed to refresh media:', error);
        }
    };

    const handleDelete = async (url: string, type: 'image' | 'video') => {
        if (!selectedProduct) return;

        try {
            await mediaApi.delete(selectedProduct._id, url, type);
            await refreshProductMedia();
        } catch (error) {
            console.error('Failed to delete media:', error);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        handleFileSelect(e.dataTransfer.files);
    };

    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <Link href="/admin/dashboard" className={styles.backLink}>
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </Link>
                <h1 className={styles.title}>Media Upload</h1>
            </header>

            <div className={styles.container}>
                {/* Product Selector */}
                <div className={styles.productSelector}>
                    <h2 className={styles.sectionTitle}>Select Product</h2>
                    {loading ? (
                        <div className={styles.loading}>Loading products...</div>
                    ) : (
                        <div className={styles.productGrid}>
                            {products.map(product => (
                                <button
                                    key={product._id}
                                    className={`${styles.productCard} ${selectedProduct?._id === product._id ? styles.selected : ''}`}
                                    onClick={() => setSelectedProduct(product)}
                                >
                                    <span className={styles.productBrand}>{product.brand}</span>
                                    <span className={styles.productName}>{product.name}</span>
                                    <span className={styles.mediaCount}>
                                        <ImageIcon size={14} /> {product.media?.images?.length || 0}
                                        <Video size={14} /> {product.media?.videos?.length || 0}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Upload Area */}
                {selectedProduct && (
                    <div className={styles.uploadSection}>
                        <h2 className={styles.sectionTitle}>
                            Upload Media for: <span className={styles.productHighlight}>{selectedProduct.name}</span>
                        </h2>

                        {/* Drag & Drop Zone */}
                        <div
                            className={`${styles.dropZone} ${dragOver ? styles.dragOver : ''}`}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                className={styles.fileInput}
                                onChange={(e) => handleFileSelect(e.target.files)}
                            />

                            {uploading ? (
                                <div className={styles.uploadingState}>
                                    <Loader2 className={styles.spinner} size={48} />
                                    <p>Uploading... {Math.round(uploadProgress)}%</p>
                                    <div className={styles.progressBar}>
                                        <div
                                            className={styles.progressFill}
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Upload size={48} className={styles.uploadIcon} />
                                    <p className={styles.dropText}>
                                        Drag & drop images or videos here
                                    </p>
                                    <p className={styles.dropSubtext}>
                                        or click to browse files
                                    </p>
                                    <p className={styles.fileTypes}>
                                        Supports: JPG, PNG, WEBP, MP4, MOV (max 10MB)
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Current Media Gallery */}
                        <div className={styles.mediaGallery}>
                            <h3 className={styles.galleryTitle}>Current Images</h3>
                            {selectedProduct.media?.images?.length > 0 ? (
                                <div className={styles.mediaGrid}>
                                    {selectedProduct.media.images.map((url, index) => (
                                        <div key={index} className={styles.mediaItem}>
                                            <img src={url} alt={`Product ${index + 1}`} />
                                            <button
                                                className={styles.deleteButton}
                                                onClick={() => handleDelete(url, 'image')}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className={styles.noMedia}>No images uploaded yet</p>
                            )}

                            <h3 className={styles.galleryTitle}>Current Videos</h3>
                            {selectedProduct.media?.videos?.length > 0 ? (
                                <div className={styles.mediaGrid}>
                                    {selectedProduct.media.videos.map((url, index) => (
                                        <div key={index} className={styles.mediaItem}>
                                            <video src={url} controls />
                                            <button
                                                className={styles.deleteButton}
                                                onClick={() => handleDelete(url, 'video')}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className={styles.noMedia}>No videos uploaded yet</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
