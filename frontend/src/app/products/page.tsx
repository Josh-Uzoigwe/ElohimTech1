'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Filter, X, ChevronDown } from 'lucide-react';
import { Header, ProductCard, Footer, WhatsAppButton } from '@/components';
import { productsApi } from '@/lib/api';
import styles from './page.module.css';

interface Product {
    _id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    media: { images: string[] };
    unitCounts?: { available: number; comingSoon: number; total: number };
    specifications: { processor?: string; ram?: string; storage?: string };
}

const brands = ['Apple', 'ASUS', 'HP', 'Dell', 'Lenovo', 'Elohimtech'];
const categories = ['Laptop', 'Accessory'];
const ramOptions = ['8GB', '16GB', '32GB', '64GB'];

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Get category from URL
    const categoryFromUrl = searchParams.get('category') || '';
    const brandFromUrl = searchParams.get('brand') || '';

    const [filters, setFilters] = useState({
        brand: brandFromUrl,
        category: categoryFromUrl,
        minPrice: '',
        maxPrice: '',
    });

    // Sync filters with URL params when they change
    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            category: categoryFromUrl,
            brand: brandFromUrl,
        }));
    }, [categoryFromUrl, brandFromUrl]);

    // Fetch products when filters change
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params: any = {};
                if (filters.brand) params.brand = filters.brand;
                if (filters.category) params.category = filters.category;
                if (filters.minPrice) params.minPrice = Number(filters.minPrice);
                if (filters.maxPrice) params.maxPrice = Number(filters.maxPrice);

                const response = await productsApi.getAll(params);
                setProducts(response.data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [filters.category, filters.brand]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        // Fetching is handled by useEffect when filters change
        setShowFilters(false);
    };

    const clearFilters = () => {
        setFilters({ brand: '', category: '', minPrice: '', maxPrice: '' });
    };

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={styles.container}>
                    {/* Page Header */}
                    <motion.div
                        className={styles.pageHeader}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className={styles.pageTitle}>
                            {filters.category || 'All'} <span className={styles.gradientText}>Products</span>
                        </h1>
                        <p className={styles.pageDescription}>
                            Browse our complete collection of premium gadgets
                        </p>
                    </motion.div>

                    {/* Filter Bar */}
                    <div className={styles.filterBar}>
                        <span className={styles.resultCount}>
                            {loading ? 'Loading...' : `${products.length} products found`}
                        </span>

                        <div className={styles.filterActions}>
                            {/* Quick Category Filters */}
                            <div className={styles.quickFilters}>
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        className={`${styles.quickFilter} ${filters.category === cat ? styles.active : ''}`}
                                        onClick={() => {
                                            handleFilterChange('category', filters.category === cat ? '' : cat);
                                        }}
                                    >
                                        {cat === 'Accessory' ? 'Accessories' : `${cat}s`}
                                    </button>
                                ))}
                            </div>

                            {/* Filter Toggle Button */}
                            <button
                                className={styles.filterButton}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter size={18} />
                                Filters
                                {activeFilterCount > 0 && (
                                    <span className={styles.filterBadge}>{activeFilterCount}</span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Expandable Filter Panel */}
                    <motion.div
                        className={styles.filterPanel}
                        initial={false}
                        animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className={styles.filterGrid}>
                            {/* Brand Filter */}
                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Brand</label>
                                <select
                                    value={filters.brand}
                                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                                    className={styles.filterSelect}
                                >
                                    <option value="">All Brands</option>
                                    {brands.map(brand => (
                                        <option key={brand} value={brand}>{brand}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Category Filter */}
                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Category</label>
                                <select
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className={styles.filterSelect}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Min Price (₦)</label>
                                <input
                                    type="number"
                                    value={filters.minPrice}
                                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                    placeholder="0"
                                    className={styles.filterInput}
                                />
                            </div>

                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Max Price (₦)</label>
                                <input
                                    type="number"
                                    value={filters.maxPrice}
                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                    placeholder="Any"
                                    className={styles.filterInput}
                                />
                            </div>
                        </div>

                        <div className={styles.filterButtons}>
                            <button className={styles.clearButton} onClick={clearFilters}>
                                Clear All
                            </button>
                            <button className={styles.applyButton} onClick={applyFilters}>
                                Apply Filters
                            </button>
                        </div>
                    </motion.div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className={styles.loadingGrid}>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className={styles.skeletonCard} />
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className={styles.productGrid}>
                            {products.map((product, index) => (
                                <ProductCard key={product._id} product={product} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <p>No products found matching your filters.</p>
                            <button className={styles.clearButton} onClick={clearFilters}>
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
            <WhatsAppButton variant="floating" />
        </>
    );
}
