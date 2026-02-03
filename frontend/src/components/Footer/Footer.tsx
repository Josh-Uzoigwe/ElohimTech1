'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer} id="contact">
            <div className={styles.container}>
                {/* Brand Column */}
                <div className={styles.brandColumn}>
                    <div className={styles.logo}>
                        <span className={styles.logoText}>Elohim</span>
                        <span className={styles.logoAccent}>tech</span>
                    </div>
                    <p className={styles.tagline}>
                        Premium gadgets store specializing in laptops and accessories.
                        Real-time availability with unique product tracking.
                    </p>
                    <div className={styles.socials}>
                        <a href="#" className={styles.socialLink}><Instagram size={20} /></a>
                        <a href="#" className={styles.socialLink}><Twitter size={20} /></a>
                        <a href="#" className={styles.socialLink}><Facebook size={20} /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className={styles.linksColumn}>
                    <h4 className={styles.columnTitle}>Quick Links</h4>
                    <Link href="/products" className={styles.link}>All Products</Link>
                    <Link href="/products?category=Laptop" className={styles.link}>Laptops</Link>
                    <Link href="/products?category=Accessory" className={styles.link}>Accessories</Link>

                </div>

                {/* Support */}
                <div className={styles.linksColumn}>
                    <h4 className={styles.columnTitle}>Support</h4>
                    <a href="#" className={styles.link}>FAQs</a>
                    <a href="#" className={styles.link}>Shipping Info</a>
                    <a href="#" className={styles.link}>Returns</a>
                    <a href="#" className={styles.link}>Track Order</a>
                </div>

                {/* Contact */}
                <div className={styles.contactColumn}>
                    <h4 className={styles.columnTitle}>Contact Us</h4>
                    <a href="https://wa.me/2348131051818" className={styles.contactItem}>
                        <Phone size={18} />
                        <span>+234 813 105 1818</span>
                    </a>
                    <a href="mailto:elohimtech001@gmail.com" className={styles.contactItem}>
                        <Mail size={18} />
                        <span>elohimtech001@gmail.com</span>
                    </a>
                    <div className={styles.contactItem}>
                        <MapPin size={18} />
                        <span>Enugu, Nigeria</span>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className={styles.bottomBar}>
                <div className={styles.bottomContent}>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} Elohimtech. All rights reserved.
                    </p>
                    <div className={styles.bottomLinks}>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
