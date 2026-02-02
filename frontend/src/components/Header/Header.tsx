'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Search, Laptop, Headphones } from 'lucide-react';
import { ThemeToggle } from '@/components';
import styles from './Header.module.css';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Laptops', href: '/products?category=Laptop', icon: Laptop },
        { name: 'Accessories', href: '/products?category=Accessory', icon: Headphones },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <motion.header
            className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <div className={styles.container}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className={styles.logoText}>Elohim</span>
                        <span className={styles.logoAccent}>tech</span>
                    </motion.div>
                </Link>

                {/* Desktop Navigation */}
                <nav className={styles.desktopNav}>
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className={styles.navLink}>
                            <motion.span
                                whileHover={{ y: -2 }}
                                transition={{ duration: 0.2 }}
                            >
                                {link.name}
                            </motion.span>
                        </Link>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className={styles.actions}>
                    <motion.button
                        className={styles.iconButton}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Search size={20} />
                    </motion.button>

                    <ThemeToggle />

                    <Link href="/admin">
                        <motion.button
                            className={styles.adminButton}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Admin
                        </motion.button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <motion.button
                    className={styles.mobileMenuButton}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    whileTap={{ scale: 0.9 }}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.button>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            className={styles.mobileMenu}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        href={link.href}
                                        className={styles.mobileNavLink}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.icon && <link.icon size={20} />}
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                            <Link href="/admin">
                                <motion.button
                                    className={styles.mobileAdminButton}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Admin Dashboard
                                </motion.button>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    );
}
