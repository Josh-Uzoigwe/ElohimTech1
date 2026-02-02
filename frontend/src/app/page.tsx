'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Header, Hero, ProductCard, WhatsAppButton, Footer } from '@/components';
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
  featured: boolean;
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsApi.getAll();
        const featured = response.data.filter((p: Product) => p.featured).slice(0, 6);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // Use placeholder data if API fails
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <Hero />

        {/* Featured Products Section */}
        <section className={styles.featuredSection} id="featured">
          <div className={styles.container}>
            <motion.div
              className={styles.sectionHeader}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className={styles.sectionBadge}>
                <Sparkles size={16} />
                Featured Collection
              </div>
              <h2 className={styles.sectionTitle}>
                Premium <span className={styles.gradientText}>Laptops</span> Available Now
              </h2>
              <p className={styles.sectionDescription}>
                Handpicked selection of top-tier laptops with verified availability.
                Each unit has a unique tag for precise tracking.
              </p>
            </motion.div>

            {loading ? (
              <div className={styles.loadingGrid}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={styles.skeletonCard} />
                ))}
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className={styles.productGrid}>
                {featuredProducts.map((product, index) => (
                  <ProductCard key={product._id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>No featured products available. Check back soon!</p>
              </div>
            )}

            <motion.div
              className={styles.viewAllWrapper}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link href="/products">
                <motion.button
                  className={styles.viewAllButton}
                  whileHover={{ scale: 1.05, gap: 16 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All Products
                  <ArrowRight size={18} />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className={styles.howItWorksSection}>
          <div className={styles.container}>
            <motion.div
              className={styles.sectionHeader}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className={styles.sectionTitle}>
                How It <span className={styles.gradientText}>Works</span>
              </h2>
              <p className={styles.sectionDescription}>
                Simple 3-step process to get your dream gadget
              </p>
            </motion.div>

            <div className={styles.stepsGrid}>
              {[
                { step: '01', title: 'Browse & Select', desc: 'Explore our premium collection and find your perfect gadget' },
                { step: '02', title: 'Check Availability', desc: 'Each product shows real-time availability with unique unit tags' },
                { step: '03', title: 'Order via WhatsApp', desc: 'Click the WhatsApp button with your chosen tag to order instantly' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className={styles.stepCard}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <span className={styles.stepNumber}>{item.step}</span>
                  <h3 className={styles.stepTitle}>{item.title}</h3>
                  <p className={styles.stepDesc}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <motion.div
              className={styles.ctaCard}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className={styles.ctaTitle}>Ready to Order?</h2>
              <p className={styles.ctaDescription}>
                Get in touch via WhatsApp for instant response. We're here to help you find the perfect gadget.
              </p>
              <WhatsAppButton variant="primary" />
              <p className={styles.ctaEmail}>
                Or email us at <a href="mailto:elohimtech001@gmail.com">elohimtech001@gmail.com</a>
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton variant="floating" />
    </>
  );
}
