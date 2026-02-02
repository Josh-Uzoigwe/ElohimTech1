'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './ProductCard.module.css';

interface Product {
    _id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    media: {
        images: string[];
    };
    unitCounts?: {
        available: number;
        comingSoon: number;
        total: number;
    };
    specifications: {
        processor?: string;
        ram?: string;
        storage?: string;
    };
}

interface ProductCardProps {
    product: Product;
    index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getAvailabilityStatus = () => {
        if (!product.unitCounts) return 'available';
        if (product.unitCounts.available > 0) return 'available';
        if (product.unitCounts.comingSoon > 0) return 'coming_soon';
        return 'taken';
    };

    const getAvailabilityText = () => {
        const status = getAvailabilityStatus();
        if (status === 'available') return `${product.unitCounts?.available || 0} Available`;
        if (status === 'coming_soon') return 'Coming Soon';
        return 'Sold Out';
    };

    // Get image source - fallback to placeholder if no image
    const imageUrl = product.media?.images?.[0];
    const hasImage = imageUrl && !imageError;

    return (
        <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.08, 0.3) }}
            whileHover={{ y: -8 }}
        >
            <Link href={`/products/${product._id}`} className={styles.link}>
                {/* Image Container */}
                <div className={styles.imageContainer}>
                    {hasImage ? (
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className={`${styles.productImage} ${imageLoaded ? styles.loaded : ''}`}
                            loading="lazy"
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className={styles.imagePlaceholder}>
                            <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="30" y="10" width="140" height="90" rx="4" fill="#1a1a24" stroke="#2a2a3d" strokeWidth="1" />
                                <rect x="35" y="15" width="130" height="80" rx="2" fill="#0a0a0f" />
                                <rect x="20" y="100" width="160" height="8" rx="2" fill="#1a1a24" stroke="#2a2a3d" strokeWidth="1" />
                                <rect x="80" y="103" width="40" height="2" rx="1" fill="#2a2a3d" />
                            </svg>
                        </div>
                    )}

                    {/* Category Badge */}
                    <span className={styles.categoryBadge}>{product.category}</span>

                    {/* Availability Badge */}
                    <span className={`${styles.availabilityBadge} ${styles[getAvailabilityStatus()]}`}>
                        {getAvailabilityText()}
                    </span>
                </div>

                {/* Product Info */}
                <div className={styles.info}>
                    <span className={styles.brand}>{product.brand}</span>
                    <h3 className={styles.name}>{product.name}</h3>

                    {/* Quick Specs */}
                    <div className={styles.specs}>
                        {product.specifications?.ram && (
                            <span className={styles.spec}>{product.specifications.ram}</span>
                        )}
                        {product.specifications?.storage && (
                            <span className={styles.spec}>{product.specifications.storage}</span>
                        )}
                    </div>

                    {/* Price */}
                    <div className={styles.priceRow}>
                        <span className={styles.price}>{formatPrice(product.price)}</span>
                        <span className={styles.viewDetails}>
                            View Details →
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
