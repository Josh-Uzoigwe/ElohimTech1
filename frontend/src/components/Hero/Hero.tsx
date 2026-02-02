'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Laptop, Shield, Truck } from 'lucide-react';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            {/* Background Effects */}
            <div className={styles.backgroundGradient} />
            <div className={styles.gridPattern} />

            <div className={styles.container}>
                <div className={styles.content}>
                    {/* Badge */}
                    <motion.div
                        className={styles.badge}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className={styles.badgeDot} />
                        Premium Gadgets Store
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Discover Your Next
                        <span className={styles.titleGradient}> Premium Laptop</span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        className={styles.description}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Shop the finest laptops and accessories with real-time availability tracking.
                        Each product features a unique 6-character tag for unit-level tracking.
                        Order directly via WhatsApp for instant response.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        className={styles.ctaGroup}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Link href="/products">
                            <motion.button
                                className={styles.primaryButton}
                                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)' }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Browse Collection
                                <ArrowRight size={18} />
                            </motion.button>
                        </Link>
                        <Link href="#featured">
                            <motion.button
                                className={styles.secondaryButton}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                View Featured
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                        className={styles.trustBadges}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <div className={styles.trustItem}>
                            <Laptop size={20} />
                            <span>Premium Brands</span>
                        </div>
                        <div className={styles.trustItem}>
                            <Shield size={20} />
                            <span>Verified Products</span>
                        </div>
                        <div className={styles.trustItem}>
                            <Truck size={20} />
                            <span>Fast Delivery</span>
                        </div>
                    </motion.div>
                </div>

                {/* Floating Laptop Visual */}
                <motion.div
                    className={styles.visual}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <div className={styles.laptopWrapper}>
                        <motion.div
                            className={styles.floatingLaptop}
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            {/* Laptop SVG Illustration */}
                            <svg className={styles.laptopSvg} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Screen */}
                                <rect x="50" y="20" width="300" height="180" rx="8" fill="#1a1a24" stroke="url(#screenGradient)" strokeWidth="2" />
                                <rect x="60" y="30" width="280" height="160" rx="4" fill="#0a0a0f" />

                                {/* Screen Content */}
                                <rect x="75" y="50" width="100" height="12" rx="2" fill="#6366f1" opacity="0.6" />
                                <rect x="75" y="70" width="180" height="8" rx="2" fill="#2a2a3d" />
                                <rect x="75" y="85" width="150" height="8" rx="2" fill="#2a2a3d" />
                                <rect x="75" y="100" width="200" height="8" rx="2" fill="#2a2a3d" />
                                <rect x="75" y="130" width="80" height="30" rx="4" fill="url(#buttonGradient)" />

                                {/* Base */}
                                <path d="M30 200 L50 200 L50 200 Q50 210 60 210 L340 210 Q350 210 350 200 L350 200 L370 200 L380 220 Q380 230 370 230 L30 230 Q20 230 20 220 Z" fill="#1a1a24" stroke="#2a2a3d" strokeWidth="1" />

                                {/* Keyboard hint */}
                                <rect x="100" y="213" width="200" height="4" rx="2" fill="#2a2a3d" />

                                {/* Gradients */}
                                <defs>
                                    <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="100%" stopColor="#8b5cf6" />
                                    </linearGradient>
                                    <linearGradient id="buttonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="100%" stopColor="#a855f7" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </motion.div>

                        {/* Glow Effect */}
                        <div className={styles.laptopGlow} />
                    </div>

                    {/* Floating Tags */}
                    <motion.div
                        className={styles.floatingTag}
                        style={{ top: '20%', right: '10%' }}
                        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <span className={`${styles.tagStatus} ${styles.available}`} />
                        LT9X2A
                    </motion.div>

                    <motion.div
                        className={styles.floatingTag}
                        style={{ bottom: '30%', left: '5%' }}
                        animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    >
                        <span className={`${styles.tagStatus} ${styles.available}`} />
                        M3P4K7
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
