'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface ScrollAnimationOptions {
    trigger?: string | Element;
    start?: string;
    end?: string;
    scrub?: boolean | number;
    markers?: boolean;
    toggleActions?: string;
    once?: boolean;
}

export function useGSAPScrollAnimation<T extends HTMLElement>(
    animationCallback: (element: T, gsapInstance: typeof gsap) => gsap.core.Timeline | gsap.core.Tween | void,
    options: ScrollAnimationOptions = {},
    deps: any[] = []
) {
    const elementRef = useRef<T>(null);

    useEffect(() => {
        if (!elementRef.current) return;

        const element = elementRef.current;
        const ctx = gsap.context(() => {
            const animation = animationCallback(element, gsap);

            if (animation) {
                ScrollTrigger.create({
                    trigger: options.trigger || element,
                    start: options.start || 'top 80%',
                    end: options.end || 'bottom 20%',
                    scrub: options.scrub || false,
                    markers: options.markers || false,
                    toggleActions: options.toggleActions || 'play none none none',
                    animation: animation,
                    once: options.once ?? true,
                });
            }
        }, element);

        return () => ctx.revert();
    }, deps);

    return elementRef;
}

// Preset scroll animations
export const scrollAnimations = {
    fadeInUp: (element: HTMLElement, gsap: typeof import('gsap').gsap) => {
        return gsap.fromTo(
            element,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        );
    },

    fadeInLeft: (element: HTMLElement, gsap: typeof import('gsap').gsap) => {
        return gsap.fromTo(
            element,
            { opacity: 0, x: -60 },
            { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
        );
    },

    fadeInRight: (element: HTMLElement, gsap: typeof import('gsap').gsap) => {
        return gsap.fromTo(
            element,
            { opacity: 0, x: 60 },
            { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
        );
    },

    scaleIn: (element: HTMLElement, gsap: typeof import('gsap').gsap) => {
        return gsap.fromTo(
            element,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)' }
        );
    },

    staggerChildren: (element: HTMLElement, gsap: typeof import('gsap').gsap, selector = '.animate-item') => {
        const children = element.querySelectorAll(selector);
        return gsap.fromTo(
            children,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
        );
    },

    parallax: (element: HTMLElement, gsap: typeof import('gsap').gsap, speed = 0.3) => {
        return gsap.to(element, {
            y: () => window.innerHeight * speed,
            ease: 'none',
        });
    },

    reveal: (element: HTMLElement, gsap: typeof import('gsap').gsap) => {
        const content = element.querySelector('.reveal-content');
        const cover = element.querySelector('.reveal-cover');

        const tl = gsap.timeline();
        if (cover) {
            tl.to(cover, { scaleX: 0, duration: 0.8, ease: 'power4.inOut', transformOrigin: 'right' });
        }
        if (content) {
            tl.fromTo(content, { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.4');
        }
        return tl;
    },

    textReveal: (element: HTMLElement, gsap: typeof import('gsap').gsap) => {
        // Split text into words for animation
        const text = element.textContent || '';
        element.innerHTML = text.split(' ').map(word =>
            `<span style="display:inline-block;overflow:hidden;"><span style="display:inline-block;" class="word">${word}</span></span>`
        ).join(' ');

        return gsap.fromTo(
            element.querySelectorAll('.word'),
            { y: '100%', opacity: 0 },
            { y: '0%', opacity: 1, duration: 0.8, stagger: 0.05, ease: 'power3.out' }
        );
    },

    floatingElements: (element: HTMLElement, gsap: typeof import('gsap').gsap) => {
        const items = element.querySelectorAll('.float-item');
        items.forEach((item, i) => {
            gsap.to(item, {
                y: gsap.utils.random(-20, 20),
                x: gsap.utils.random(-10, 10),
                rotation: gsap.utils.random(-5, 5),
                duration: gsap.utils.random(2, 4),
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 0.2,
            });
        });
    },
};
