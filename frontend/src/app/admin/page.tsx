'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { authApi } from '@/lib/api';
import styles from './page.module.css';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authApi.login(email, password);
            localStorage.setItem('adminToken', response.data.token);
            localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
            router.push('/admin/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.backgroundGradient} />

            <motion.div
                className={styles.loginCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <span className={styles.logoText}>Elohim</span>
                        <span className={styles.logoAccent}>tech</span>
                    </div>
                    <h1 className={styles.title}>Admin Portal</h1>
                    <p className={styles.subtitle}>Sign in to manage your store</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && (
                        <motion.div
                            className={styles.error}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <AlertCircle size={18} />
                            {error}
                        </motion.div>
                    )}

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Email</label>
                        <div className={styles.inputWrapper}>
                            <Mail size={18} className={styles.inputIcon} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@elohimtech.com"
                                className={styles.input}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Password</label>
                        <div className={styles.inputWrapper}>
                            <Lock size={18} className={styles.inputIcon} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className={styles.input}
                                required
                            />
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </motion.button>
                </form>

                <div className={styles.footer}>
                    <p>Default: admin@elohimtech.com / Admin@123</p>
                </div>
            </motion.div>
        </div>
    );
}
