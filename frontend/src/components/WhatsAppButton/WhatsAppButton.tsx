'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import styles from './WhatsAppButton.module.css';

interface WhatsAppButtonProps {
    productName?: string;
    unitTag?: string;
    variant?: 'primary' | 'secondary' | 'floating';
    className?: string;
}

export default function WhatsAppButton({
    productName,
    unitTag,
    variant = 'primary',
    className = ''
}: WhatsAppButtonProps) {
    const phoneNumber = '2348131051818';

    const generateMessage = () => {
        if (productName && unitTag) {
            return `Hello Elohimtech, I'm interested in this laptop.\nProduct Name: ${productName}\nProduct Tag: ${unitTag}\nIs this still available? I'd like to know the final price and how to proceed with payment`;
        }
        if (productName) {
            return `Hello Elohimtech, I'm interested in this laptop.\nProduct Name: ${productName}\nIs this still available? I'd like to know the final price and how to proceed with payment`;
        }
        return `Hello Elohimtech, I'm interested in your products. Please share available options and pricing.`;
    };

    const handleClick = () => {
        const message = encodeURIComponent(generateMessage());
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    return (
        <motion.button
            className={`${styles.button} ${styles[variant]} ${className}`}
            onClick={handleClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <MessageCircle size={variant === 'floating' ? 24 : 20} />
            {variant !== 'floating' && <span>Order via WhatsApp</span>}
        </motion.button>
    );
}
