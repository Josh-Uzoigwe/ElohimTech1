'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    Tags,
    Receipt,
    LogOut,
    Plus,
    Check,
    X,
    RefreshCw,
    Image as ImageIcon,
    Home,
    Edit,
    Trash2,
    Key
} from 'lucide-react';
import { productsApi, unitsApi, ordersApi, authApi } from '@/lib/api';
import styles from './page.module.css';

type Tab = 'products' | 'units' | 'orders';

interface Product {
    _id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    description?: string;
    unitCounts?: { available: number; total: number };
}

interface Unit {
    _id: string;
    uniqueTag: string;
    status: string;
    productId: { _id: string; name: string; brand: string; price: number };
}

interface Order {
    _id: string;
    receiptId: string;
    unitTag: string;
    productName: string;
    customerName: string;
    price: number;
    status: string;
    createdAt: string;
}

const defaultProductForm = {
    name: '',
    brand: '',
    category: 'Laptop',
    description: '',
    price: '',
    processor: '',
    ram: '',
    storage: '',
    display: '',
};

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('products');
    const [products, setProducts] = useState<Product[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [adminName, setAdminName] = useState('Admin');

    // Product creation modal
    const [showProductModal, setShowProductModal] = useState(false);
    const [productForm, setProductForm] = useState(defaultProductForm);
    const [creatingProduct, setCreatingProduct] = useState(false);

    // Sale confirmation modal
    const [showSaleModal, setShowSaleModal] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
    const [saleForm, setSaleForm] = useState({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        notes: '',
    });
    const [confirmingDeposit, setConfirmingDeposit] = useState(false);

    // Edit product modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editForm, setEditForm] = useState(defaultProductForm);
    const [savingEdit, setSavingEdit] = useState(false);

    // Delete confirmation modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Password change modal
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin');
            return;
        }

        const adminInfo = localStorage.getItem('adminInfo');
        if (adminInfo) {
            setAdminName(JSON.parse(adminInfo).name);
        }

        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productsRes, unitsRes, ordersRes] = await Promise.all([
                productsApi.getAll(),
                unitsApi.getAll(),
                ordersApi.getAll(),
            ]);
            setProducts(productsRes.data);
            setUnits(unitsRes.data);
            setOrders(ordersRes.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
        router.push('/admin');
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleStatusUpdate = async (tag: string, newStatus: string) => {
        try {
            await unitsApi.updateStatus(tag, newStatus);
            fetchData();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const openSaleModal = (unit: Unit) => {
        setSelectedUnit(unit);
        setShowSaleModal(true);
        setSaleForm({ customerName: '', customerPhone: '', customerEmail: '', notes: '' });
    };

    const confirmSale = async () => {
        if (!selectedUnit || !saleForm.customerName) return;
        setConfirmingDeposit(true);
        try {
            await ordersApi.confirmSale({
                unitTag: selectedUnit.uniqueTag,
                customerName: saleForm.customerName,
                customerPhone: saleForm.customerPhone,
                customerEmail: saleForm.customerEmail,
                notes: saleForm.notes,
            });
            setShowSaleModal(false);
            fetchData();
        } catch (error) {
            console.error('Failed to confirm sale:', error);
        } finally {
            setConfirmingDeposit(false);
        }
    };

    const generateNewTag = async (productId: string) => {
        try {
            await unitsApi.create({ productId, status: 'available' });
            fetchData();
        } catch (error) {
            console.error('Failed to generate tag:', error);
        }
    };

    const createProduct = async () => {
        if (!productForm.name || !productForm.brand || !productForm.price) return;
        setCreatingProduct(true);
        try {
            const productData = {
                name: productForm.name,
                brand: productForm.brand,
                category: productForm.category,
                description: productForm.description,
                price: parseInt(productForm.price),
                specifications: {
                    processor: productForm.processor || undefined,
                    ram: productForm.ram || undefined,
                    storage: productForm.storage || undefined,
                    display: productForm.display || undefined,
                },
                media: { images: [], videos: [] },
                featured: false,
            };
            await productsApi.create(productData);
            setShowProductModal(false);
            setProductForm(defaultProductForm);
            fetchData();
        } catch (error) {
            console.error('Failed to create product:', error);
        } finally {
            setCreatingProduct(false);
        }
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setEditForm({
            name: product.name,
            brand: product.brand,
            category: product.category,
            description: product.description || '',
            price: product.price.toString(),
            processor: '',
            ram: '',
            storage: '',
            display: '',
        });
        setShowEditModal(true);
    };

    const saveEdit = async () => {
        if (!editingProduct || !editForm.name || !editForm.brand || !editForm.price) return;
        setSavingEdit(true);
        try {
            const updateData = {
                name: editForm.name,
                brand: editForm.brand,
                category: editForm.category,
                description: editForm.description,
                price: parseInt(editForm.price),
            };
            await productsApi.update(editingProduct._id, updateData);
            setShowEditModal(false);
            setEditingProduct(null);
            fetchData();
        } catch (error) {
            console.error('Failed to update product:', error);
        } finally {
            setSavingEdit(false);
        }
    };

    const openDeleteModal = (product: Product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const deleteProduct = async () => {
        if (!productToDelete) return;
        setDeleting(true);
        try {
            await productsApi.delete(productToDelete._id);
            setShowDeleteModal(false);
            setProductToDelete(null);
            fetchData();
        } catch (error) {
            console.error('Failed to delete product:', error);
        } finally {
            setDeleting(false);
        }
    };

    const handleChangePassword = async () => {
        setPasswordError('');

        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            setPasswordError('All fields are required');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters');
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        setChangingPassword(true);
        try {
            await authApi.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
            setShowPasswordModal(false);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            alert('Password changed successfully!');
        } catch (error: any) {
            setPasswordError(error.response?.data?.message || 'Failed to change password');
        } finally {
            setChangingPassword(false);
        }
    };

    const stats = {
        totalProducts: products.length,
        availableUnits: units.filter(u => u.status === 'available').length,
        totalOrders: orders.length,
        revenue: orders.reduce((sum, o) => sum + o.price, 0),
    };

    return (
        <div className={styles.dashboard}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <span className={styles.logoText}>Elohim</span>
                    <span className={styles.logoAccent}>tech</span>
                </div>

                <nav className={styles.nav}>
                    <Link href="/" className={styles.navItem}>
                        <Home size={20} />
                        View Store
                    </Link>
                    <div className={styles.navDivider} />
                    {[
                        { id: 'products' as Tab, label: 'Products', icon: Package },
                        { id: 'units' as Tab, label: 'Unit Tags', icon: Tags },
                        { id: 'orders' as Tab, label: 'Orders', icon: Receipt },
                    ].map(item => (
                        <button
                            key={item.id}
                            className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </button>
                    ))}
                    <Link href="/admin/media" className={styles.navItem}>
                        <ImageIcon size={20} />
                        Media Upload
                    </Link>
                </nav>

                <div className={styles.sidebarFooter}>
                    <span className={styles.adminName}>{adminName}</span>
                    <button
                        className={styles.changePasswordButton}
                        onClick={() => {
                            setPasswordError('');
                            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                            setShowPasswordModal(true);
                        }}
                    >
                        <Key size={18} />
                        Change Password
                    </button>
                    <button className={styles.logoutButton} onClick={handleLogout}>
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                {/* Header */}
                <header className={styles.header}>
                    <div>
                        <h1 className={styles.pageTitle}>
                            {activeTab === 'products' && 'Products'}
                            {activeTab === 'units' && 'Unit Tags'}
                            {activeTab === 'orders' && 'Orders & Receipts'}
                        </h1>
                        <p className={styles.pageSubtitle}>Manage your store inventory</p>
                    </div>
                    <div className={styles.headerActions}>
                        {activeTab === 'products' && (
                            <button
                                className={styles.addButton}
                                onClick={() => setShowProductModal(true)}
                            >
                                <Plus size={18} />
                                Add Product
                            </button>
                        )}
                        <button className={styles.refreshButton} onClick={fetchData}>
                            <RefreshCw size={18} className={loading ? styles.spinning : ''} />
                            Refresh
                        </button>
                    </div>
                </header>

                {/* Stats */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>Total Products</span>
                        <span className={styles.statValue}>{stats.totalProducts}</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>Available Units</span>
                        <span className={styles.statValue}>{stats.availableUnits}</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>Total Orders</span>
                        <span className={styles.statValue}>{stats.totalOrders}</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>Total Revenue</span>
                        <span className={styles.statValue}>{formatPrice(stats.revenue)}</span>
                    </div>
                </div>

                {/* Content Area */}
                <div className={styles.content}>
                    {loading ? (
                        <div className={styles.loading}>Loading...</div>
                    ) : (
                        <>
                            {/* Products Tab */}
                            {activeTab === 'products' && (
                                <div className={styles.tableContainer}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Brand</th>
                                                <th>Category</th>
                                                <th>Price</th>
                                                <th>Units</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map(product => (
                                                <tr key={product._id}>
                                                    <td className={styles.productName}>{product.name}</td>
                                                    <td>{product.brand}</td>
                                                    <td>
                                                        <span className={styles.categoryBadge}>{product.category}</span>
                                                    </td>
                                                    <td className={styles.price}>{formatPrice(product.price)}</td>
                                                    <td>
                                                        <span className={styles.unitCount}>
                                                            {product.unitCounts?.available || 0} / {product.unitCounts?.total || 0}
                                                        </span>
                                                    </td>
                                                    <td className={styles.actionButtons}>
                                                        <button
                                                            className={styles.actionButton}
                                                            onClick={() => generateNewTag(product._id)}
                                                            title="Generate new tag"
                                                        >
                                                            <Plus size={16} />
                                                            Add Tag
                                                        </button>
                                                        <button
                                                            className={`${styles.actionButton} ${styles.edit}`}
                                                            onClick={() => openEditModal(product)}
                                                            title="Edit product"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            className={`${styles.actionButton} ${styles.delete}`}
                                                            onClick={() => openDeleteModal(product)}
                                                            title="Delete product"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Units Tab */}
                            {activeTab === 'units' && (
                                <div className={styles.tableContainer}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Tag</th>
                                                <th>Product</th>
                                                <th>Price</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {units.map(unit => (
                                                <tr key={unit._id}>
                                                    <td>
                                                        <span className={styles.tagCode}>{unit.uniqueTag}</span>
                                                    </td>
                                                    <td className={styles.productName}>
                                                        {unit.productId?.name || 'Unknown'}
                                                    </td>
                                                    <td className={styles.price}>
                                                        {formatPrice(unit.productId?.price || 0)}
                                                    </td>
                                                    <td>
                                                        <span className={`${styles.statusBadge} ${styles[unit.status]}`}>
                                                            {unit.status.replace('_', ' ')}
                                                        </span>
                                                    </td>
                                                    <td className={styles.actionButtons}>
                                                        {unit.status === 'available' && (
                                                            <button
                                                                className={`${styles.actionButton} ${styles.confirm}`}
                                                                onClick={() => openSaleModal(unit)}
                                                            >
                                                                <Check size={16} />
                                                                Confirm Sale
                                                            </button>
                                                        )}
                                                        {unit.status !== 'taken' && (
                                                            <select
                                                                className={styles.statusSelect}
                                                                value={unit.status}
                                                                onChange={(e) => handleStatusUpdate(unit.uniqueTag, e.target.value)}
                                                            >
                                                                <option value="available">Available</option>
                                                                <option value="coming_soon">Coming Soon</option>
                                                                <option value="taken">Taken</option>
                                                            </select>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Orders Tab */}
                            {activeTab === 'orders' && (
                                <div className={styles.tableContainer}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Receipt ID</th>
                                                <th>Product</th>
                                                <th>Tag</th>
                                                <th>Customer</th>
                                                <th>Amount</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <tr key={order._id}>
                                                    <td>
                                                        <span className={styles.receiptId}>{order.receiptId}</span>
                                                    </td>
                                                    <td className={styles.productName}>{order.productName}</td>
                                                    <td>
                                                        <span className={styles.tagCode}>{order.unitTag}</span>
                                                    </td>
                                                    <td>{order.customerName}</td>
                                                    <td className={styles.price}>{formatPrice(order.price)}</td>
                                                    <td className={styles.date}>
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* Product Creation Modal */}
            <AnimatePresence>
                {showProductModal && (
                    <motion.div
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowProductModal(false)}
                    >
                        <motion.div
                            className={styles.modal}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                <h2 className={styles.modalTitle}>Add New Product</h2>
                                <button className={styles.closeButton} onClick={() => setShowProductModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div className={styles.modalForm}>
                                <div className={styles.formRow}>
                                    <input
                                        type="text"
                                        placeholder="Product Name *"
                                        value={productForm.name}
                                        onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                                        className={styles.modalInput}
                                        required
                                    />
                                </div>
                                <div className={styles.formRow}>
                                    <input
                                        type="text"
                                        placeholder="Brand *"
                                        value={productForm.brand}
                                        onChange={(e) => setProductForm(prev => ({ ...prev, brand: e.target.value }))}
                                        className={styles.modalInput}
                                        required
                                    />
                                    <select
                                        value={productForm.category}
                                        onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                                        className={styles.modalInput}
                                    >
                                        <option value="Laptop">Laptop</option>
                                        <option value="Accessory">Accessory</option>
                                        <option value="Phone">Phone</option>
                                        <option value="Tablet">Tablet</option>
                                    </select>
                                </div>
                                <div className={styles.formRow}>
                                    <input
                                        type="number"
                                        placeholder="Price (₦) *"
                                        value={productForm.price}
                                        onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                                        className={styles.modalInput}
                                        required
                                    />
                                </div>
                                <textarea
                                    placeholder="Description"
                                    value={productForm.description}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                                    className={styles.modalTextarea}
                                    rows={3}
                                />
                                <div className={styles.specsSection}>
                                    <h4 className={styles.specsTitle}>Specifications (Optional)</h4>
                                    <div className={styles.formRow}>
                                        <input
                                            type="text"
                                            placeholder="Processor"
                                            value={productForm.processor}
                                            onChange={(e) => setProductForm(prev => ({ ...prev, processor: e.target.value }))}
                                            className={styles.modalInput}
                                        />
                                        <input
                                            type="text"
                                            placeholder="RAM"
                                            value={productForm.ram}
                                            onChange={(e) => setProductForm(prev => ({ ...prev, ram: e.target.value }))}
                                            className={styles.modalInput}
                                        />
                                    </div>
                                    <div className={styles.formRow}>
                                        <input
                                            type="text"
                                            placeholder="Storage"
                                            value={productForm.storage}
                                            onChange={(e) => setProductForm(prev => ({ ...prev, storage: e.target.value }))}
                                            className={styles.modalInput}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Display"
                                            value={productForm.display}
                                            onChange={(e) => setProductForm(prev => ({ ...prev, display: e.target.value }))}
                                            className={styles.modalInput}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setShowProductModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.confirmButton}
                                    onClick={createProduct}
                                    disabled={!productForm.name || !productForm.brand || !productForm.price || creatingProduct}
                                >
                                    {creatingProduct ? 'Creating...' : 'Create Product'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sale Confirmation Modal */}
            <AnimatePresence>
                {showSaleModal && selectedUnit && (
                    <motion.div
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowSaleModal(false)}
                    >
                        <motion.div
                            className={styles.modal}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className={styles.modalTitle}>Confirm Sale</h2>
                            <p className={styles.modalSubtitle}>
                                Unit: <strong>{selectedUnit.uniqueTag}</strong> - {selectedUnit.productId?.name}
                            </p>
                            <p className={styles.modalPrice}>
                                {formatPrice(selectedUnit.productId?.price || 0)}
                            </p>

                            <div className={styles.modalForm}>
                                <input
                                    type="text"
                                    placeholder="Customer Name *"
                                    value={saleForm.customerName}
                                    onChange={(e) => setSaleForm(prev => ({ ...prev, customerName: e.target.value }))}
                                    className={styles.modalInput}
                                    required
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={saleForm.customerPhone}
                                    onChange={(e) => setSaleForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                                    className={styles.modalInput}
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={saleForm.customerEmail}
                                    onChange={(e) => setSaleForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                                    className={styles.modalInput}
                                />
                                <textarea
                                    placeholder="Notes (optional)"
                                    value={saleForm.notes}
                                    onChange={(e) => setSaleForm(prev => ({ ...prev, notes: e.target.value }))}
                                    className={styles.modalTextarea}
                                />
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setShowSaleModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.confirmButton}
                                    onClick={confirmSale}
                                    disabled={!saleForm.customerName || confirmingDeposit}
                                >
                                    {confirmingDeposit ? 'Processing...' : 'Confirm & Generate Receipt'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Product Modal */}
            <AnimatePresence>
                {showEditModal && editingProduct && (
                    <motion.div
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowEditModal(false)}
                    >
                        <motion.div
                            className={styles.modal}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                <h2 className={styles.modalTitle}>Edit Product</h2>
                                <button className={styles.closeButton} onClick={() => setShowEditModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div className={styles.modalForm}>
                                <div className={styles.formRow}>
                                    <input
                                        type="text"
                                        placeholder="Product Name *"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                        className={styles.modalInput}
                                        required
                                    />
                                </div>
                                <div className={styles.formRow}>
                                    <input
                                        type="text"
                                        placeholder="Brand *"
                                        value={editForm.brand}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, brand: e.target.value }))}
                                        className={styles.modalInput}
                                        required
                                    />
                                    <select
                                        value={editForm.category}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                                        className={styles.modalInput}
                                    >
                                        <option value="Laptop">Laptop</option>
                                        <option value="Accessory">Accessory</option>
                                        <option value="Phone">Phone</option>
                                        <option value="Tablet">Tablet</option>
                                    </select>
                                </div>
                                <div className={styles.formRow}>
                                    <input
                                        type="number"
                                        placeholder="Price (₦) *"
                                        value={editForm.price}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                                        className={styles.modalInput}
                                        required
                                    />
                                </div>
                                <textarea
                                    placeholder="Description"
                                    value={editForm.description}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                    className={styles.modalTextarea}
                                    rows={3}
                                />
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.confirmButton}
                                    onClick={saveEdit}
                                    disabled={!editForm.name || !editForm.brand || !editForm.price || savingEdit}
                                >
                                    {savingEdit ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && productToDelete && (
                    <motion.div
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowDeleteModal(false)}
                    >
                        <motion.div
                            className={styles.modal}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className={styles.modalTitle}>Delete Product</h2>
                            <p className={styles.modalSubtitle}>
                                Are you sure you want to delete <strong>{productToDelete.name}</strong>?
                            </p>
                            <p className={styles.deleteWarning}>
                                This action cannot be undone. All unit tags associated with this product will also be removed.
                            </p>

                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.deleteButton}
                                    onClick={deleteProduct}
                                    disabled={deleting}
                                >
                                    {deleting ? 'Deleting...' : 'Delete Product'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Password Change Modal */}
            <AnimatePresence>
                {showPasswordModal && (
                    <motion.div
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowPasswordModal(false)}
                    >
                        <motion.div
                            className={styles.modal}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                <h2 className={styles.modalTitle}>Change Password</h2>
                                <button className={styles.closeButton} onClick={() => setShowPasswordModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>

                            {passwordError && (
                                <div className={styles.errorMessage}>{passwordError}</div>
                            )}

                            <div className={styles.modalForm}>
                                <input
                                    type="password"
                                    placeholder="Current Password *"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                    className={styles.modalInput}
                                />
                                <input
                                    type="password"
                                    placeholder="New Password *"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                    className={styles.modalInput}
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm New Password *"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className={styles.modalInput}
                                />
                                <p className={styles.passwordHint}>Password must be at least 6 characters</p>
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setShowPasswordModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.confirmButton}
                                    onClick={handleChangePassword}
                                    disabled={changingPassword}
                                >
                                    {changingPassword ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
