'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Clock, XCircle, Copy, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Header, Footer, WhatsAppButton } from '@/components';
import { productsApi } from '@/lib/api';
import styles from './page.module.css';

interface Unit {
    id: string;
    tag: string;
    status: 'available' | 'taken' | 'coming_soon';
}

interface Product {
    _id: string;
    name: string;
    brand: string;
    category: string;
    description: string;
    price: number;
    media: { images: string[]; videos: string[] };
    specifications: {
        processor?: string;
        ram?: string;
        storage?: string;
        display?: string;
        gpu?: string;
        battery?: string;
        weight?: string;
        os?: string;
        ports?: string;
    };
    units: Unit[];
}

export default function ProductDetailsPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
    const [copiedTag, setCopiedTag] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!params.id) return;
            try {
                const response = await productsApi.getById(params.id as string);
                setProduct(response.data);
                // Auto-select first available unit
                const availableUnit = response.data.units?.find((u: Unit) => u.status === 'available');
                if (availableUnit) setSelectedUnit(availableUnit);
            } catch (error) {
                console.error('Failed to fetch product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [params.id]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const copyTag = (tag: string) => {
        navigator.clipboard.writeText(tag);
        setCopiedTag(tag);
        setTimeout(() => setCopiedTag(null), 2000);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'available': return <Check size={14} />;
            case 'coming_soon': return <Clock size={14} />;
            default: return <XCircle size={14} />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'available': return 'Available';
            case 'coming_soon': return 'Coming Soon';
            default: return 'Sold';
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <div className={styles.container}>
                        <div className={styles.loading}>Loading...</div>
                    </div>
                </main>
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <div className={styles.container}>
                        <div className={styles.notFound}>
                            <h1>Product Not Found</h1>
                            <Link href="/products">
                                <button className={styles.backButton}>
                                    <ArrowLeft size={18} />
                                    Back to Products
                                </button>
                            </Link>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    const availableUnits = product.units?.filter(u => u.status === 'available') || [];
    const comingSoonUnits = product.units?.filter(u => u.status === 'coming_soon') || [];

    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={styles.container}>
                    {/* Breadcrumb */}
                    <Link href="/products" className={styles.breadcrumb}>
                        <ArrowLeft size={18} />
                        Back to Products
                    </Link>

                    <div className={styles.productGrid}>
                        {/* Product Image */}
                        <motion.div
                            className={styles.imageSection}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className={styles.mainImage}>
                                {product.media?.images && product.media.images.length > 0 ? (
                                    <img
                                        src={product.media.images[0]}
                                        alt={product.name}
                                        className={styles.productImage}
                                    />
                                ) : (
                                    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="50" y="20" width="300" height="180" rx="8" fill="#1a1a24" stroke="url(#screenGradient2)" strokeWidth="2" />
                                        <rect x="60" y="30" width="280" height="160" rx="4" fill="#0a0a0f" />
                                        <rect x="75" y="50" width="100" height="12" rx="2" fill="#6366f1" opacity="0.6" />
                                        <rect x="75" y="70" width="180" height="8" rx="2" fill="#2a2a3d" />
                                        <rect x="75" y="85" width="150" height="8" rx="2" fill="#2a2a3d" />
                                        <rect x="75" y="100" width="200" height="8" rx="2" fill="#2a2a3d" />
                                        <rect x="75" y="130" width="80" height="30" rx="4" fill="url(#buttonGradient2)" />
                                        <path d="M30 200 L50 200 Q50 210 60 210 L340 210 Q350 210 350 200 L370 200 L380 220 Q380 230 370 230 L30 230 Q20 230 20 220 Z" fill="#1a1a24" stroke="#2a2a3d" strokeWidth="1" />
                                        <rect x="100" y="213" width="200" height="4" rx="2" fill="#2a2a3d" />
                                        <defs>
                                            <linearGradient id="screenGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#6366f1" />
                                                <stop offset="100%" stopColor="#8b5cf6" />
                                            </linearGradient>
                                            <linearGradient id="buttonGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#6366f1" />
                                                <stop offset="100%" stopColor="#a855f7" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                )}
                            </div>
                            <div className={styles.brandBadge}>{product.brand}</div>
                        </motion.div>

                        {/* Product Info */}
                        <motion.div
                            className={styles.infoSection}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <span className={styles.category}>{product.category}</span>
                            <h1 className={styles.productName}>{product.name}</h1>
                            <p className={styles.description}>{product.description}</p>

                            <div className={styles.priceSection}>
                                <span className={styles.price}>{formatPrice(product.price)}</span>
                                <span className={styles.availability}>
                                    {availableUnits.length > 0 ? (
                                        <><Check size={16} /> {availableUnits.length} units available</>
                                    ) : comingSoonUnits.length > 0 ? (
                                        <><Clock size={16} /> Coming Soon</>
                                    ) : (
                                        <><XCircle size={16} /> Out of Stock</>
                                    )}
                                </span>
                            </div>

                            {/* Unit Tags */}
                            {product.units && product.units.length > 0 && (
                                <div className={styles.unitsSection}>
                                    <h3 className={styles.unitsTitle}>Available Units</h3>
                                    <p className={styles.unitsSubtitle}>Select a unit tag to order</p>
                                    <div className={styles.unitsTags}>
                                        {product.units.map(unit => (
                                            <motion.button
                                                key={unit.id}
                                                className={`${styles.unitTag} ${styles[unit.status]} ${selectedUnit?.tag === unit.tag ? styles.selected : ''}`}
                                                onClick={() => unit.status === 'available' && setSelectedUnit(unit)}
                                                disabled={unit.status !== 'available'}
                                                whileHover={unit.status === 'available' ? { scale: 1.02 } : {}}
                                                whileTap={unit.status === 'available' ? { scale: 0.98 } : {}}
                                            >
                                                <span className={styles.tagCode}>{unit.tag}</span>
                                                <span className={styles.tagStatus}>
                                                    {getStatusIcon(unit.status)}
                                                    {getStatusText(unit.status)}
                                                </span>
                                                {unit.status === 'available' && (
                                                    <button
                                                        className={styles.copyButton}
                                                        onClick={(e) => { e.stopPropagation(); copyTag(unit.tag); }}
                                                    >
                                                        {copiedTag === unit.tag ? <Check size={14} /> : <Copy size={14} />}
                                                    </button>
                                                )}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Order Button */}
                            <div className={styles.orderSection}>
                                {selectedUnit ? (
                                    <WhatsAppButton
                                        productName={product.name}
                                        unitTag={selectedUnit.tag}
                                    />
                                ) : (
                                    <WhatsAppButton productName={product.name} />
                                )}
                                <p className={styles.orderNote}>
                                    {selectedUnit
                                        ? `Selected tag: ${selectedUnit.tag} - Click to order via WhatsApp`
                                        : 'Select an available unit above, or contact us for more options'}
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Specifications */}
                    <motion.section
                        className={styles.specsSection}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h2 className={styles.specsTitle}>Specifications</h2>
                        <div className={styles.specsGrid}>
                            {Object.entries(product.specifications).map(([key, value]) => (
                                value && (
                                    <div key={key} className={styles.specItem}>
                                        <span className={styles.specLabel}>
                                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </span>
                                        <span className={styles.specValue}>{value}</span>
                                    </div>
                                )
                            ))}
                        </div>
                    </motion.section>
                </div>
            </main>
            <Footer />
            <WhatsAppButton variant="floating" />
        </>
    );
}
