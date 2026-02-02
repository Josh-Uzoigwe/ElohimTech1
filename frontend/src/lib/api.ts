import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token interceptor
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Products API
export const productsApi = {
    getAll: (params?: { brand?: string; category?: string; minPrice?: number; maxPrice?: number }) =>
        api.get('/products', { params }),

    getFeatured: () => api.get('/products/featured'),

    getById: (id: string) => api.get(`/products/${id}`),

    create: (data: any) => api.post('/products', data),

    update: (id: string, data: any) => api.put(`/products/${id}`, data),

    delete: (id: string) => api.delete(`/products/${id}`),
};

// Units API
export const unitsApi = {
    getAll: (status?: string) => api.get('/units', { params: { status } }),

    getByTag: (tag: string) => api.get(`/units/tag/${tag}`),

    getByProduct: (productId: string) => api.get(`/units/product/${productId}`),

    create: (data: { productId: string; status?: string }) => api.post('/units', data),

    updateStatus: (tag: string, status: string) => api.patch(`/units/${tag}`, { status }),

    delete: (tag: string) => api.delete(`/units/${tag}`),
};

// Orders API
export const ordersApi = {
    getAll: (status?: string) => api.get('/orders', { params: { status } }),

    confirmSale: (data: {
        unitTag: string;
        customerName: string;
        customerPhone?: string;
        customerEmail?: string;
        notes?: string;
    }) => api.post('/orders/confirm', data),

    getReceipt: (receiptId: string) => api.get(`/orders/receipt/${receiptId}`),

    updateStatus: (receiptId: string, status: string) => api.patch(`/orders/${receiptId}`, { status }),
};

// Auth API
export const authApi = {
    login: (email: string, password: string) => api.post('/auth/login', { email, password }),

    getProfile: () => api.get('/auth/profile'),

    changePassword: (currentPassword: string, newPassword: string) =>
        api.post('/auth/change-password', { currentPassword, newPassword }),
};

// Media API
export const mediaApi = {
    getProductMedia: (productId: string) => api.get(`/media/${productId}`),

    upload: (productId: string, file: File, mediaType: 'image' | 'video' = 'image') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('productId', productId);
        formData.append('mediaType', mediaType);
        return api.post('/media/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    delete: (productId: string, url: string, mediaType: 'image' | 'video' = 'image') =>
        api.delete('/media', { data: { productId, url, mediaType } }),
};

export default api;
