'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import styles from './ScrollShowcase.module.css';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface ScrollShowcaseProps {
    products: Array<{
        _id: string;
        name: string;
        brand: string;
        price: number;
    }>;
}

export default function ScrollShowcase({ products }: ScrollShowcaseProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !titleRef.current || !cardsRef.current) return;

        const ctx = gsap.context(() => {
            // Title parallax effect
            gsap.to(titleRef.current, {
                y: -100,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                },
            });

            // Cards horizontal scroll
            const cards = cardsRef.current?.querySelectorAll(`.${styles.showcaseCard}`);
            if (cards && cards.length > 0) {
                gsap.fromTo(
                    cards,
                    { x: 100, opacity: 0, rotateY: 15 },
                    {
                        x: 0,
                        opacity: 1,
                        rotateY: 0,
                        duration: 1,
                        stagger: 0.2,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: cardsRef.current,
                            start: 'top 85%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            }

            // Floating animation for decorative elements
            const floatElements = containerRef.current?.querySelectorAll(`.${styles.floatElement}`);
            floatElements?.forEach((el, i) => {
                gsap.to(el, {
                    y: gsap.utils.random(-30, 30),
                    x: gsap.utils.random(-20, 20),
                    rotation: gsap.utils.random(-10, 10),
                    duration: gsap.utils.random(3, 5),
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: i * 0.3,
                });
            });

            // Gradient background shift on scroll
            gsap.to(containerRef.current, {
                '--gradient-shift': '100%',
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top center',
                    end: 'bottom center',
                    scrub: 1,
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, [products]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <section className={styles.showcase} ref={containerRef}>
            {/* Decorative floating elements */}
            <div className={`${styles.floatElement} ${styles.floatElement1}`} />
            <div className={`${styles.floatElement} ${styles.floatElement2}`} />
            <div className={`${styles.floatElement} ${styles.floatElement3}`} />

            <div className={styles.container}>
                <h2 className={styles.title} ref={titleRef}>
                    <span className={styles.titleLine}>Premium</span>
                    <span className={styles.titleHighlight}>Experience</span>
                </h2>

                <div className={styles.cardsWrapper} ref={cardsRef}>
                    {products.slice(0, 4).map((product, index) => (
                        <div key={product._id} className={styles.showcaseCard}>
                            <div className={styles.cardGlow} />
                            <span className={styles.cardIndex}>0{index + 1}</span>
                            <div className={styles.cardContent}>
                                <span className={styles.cardBrand}>{product.brand}</span>
                                <h3 className={styles.cardName}>{product.name}</h3>
                                <span className={styles.cardPrice}>{formatPrice(product.price)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
