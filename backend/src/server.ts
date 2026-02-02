import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { authRoutes, productRoutes, unitRoutes, orderRoutes, mediaRoutes } from './routes';
import { Admin } from './models';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/media', mediaRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Create default admin if not exists
async function createDefaultAdmin() {
    try {
        const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
        if (!adminExists) {
            const admin = new Admin({
                email: process.env.ADMIN_EMAIL || 'admin@elohimtech.com',
                password: process.env.ADMIN_PASSWORD || 'Admin@123',
                name: 'Elohimtech Admin',
            });
            await admin.save();
            console.log('✅ Default admin created');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
}

// Seed sample products
async function seedProducts() {
    const { Product, Unit } = await import('./models');

    const productCount = await Product.countDocuments();
    if (productCount > 0) return;

    console.log('🌱 Seeding sample products...');

    const products = [
        {
            name: 'MacBook Pro 14" M3 Pro',
            brand: 'Apple',
            category: 'Laptop',
            description: 'The most powerful MacBook Pro ever with the M3 Pro chip. Perfect for professionals who need serious performance.',
            specifications: {
                processor: 'Apple M3 Pro (11-core CPU, 14-core GPU)',
                ram: '18GB Unified Memory',
                storage: '512GB SSD',
                display: '14.2" Liquid Retina XDR',
                battery: 'Up to 17 hours',
                weight: '1.55 kg',
                os: 'macOS Sonoma',
                ports: 'HDMI, SDXC, MagSafe 3, 3x Thunderbolt 4',
            },
            price: 1250000,
            media: {
                images: ['/images/macbook-pro-14.jpg'],
                videos: [],
            },
            featured: true,
        },
        {
            name: 'ASUS ROG Strix G16',
            brand: 'ASUS',
            category: 'Laptop',
            description: 'Unleash gaming supremacy with ROG Strix G16. Dominate every game with incredible performance.',
            specifications: {
                processor: 'Intel Core i9-13980HX',
                ram: '32GB DDR5',
                storage: '1TB PCIe 4.0 NVMe SSD',
                display: '16" QHD+ 240Hz',
                gpu: 'NVIDIA RTX 4070 8GB',
                battery: '90Whr',
                weight: '2.5 kg',
                os: 'Windows 11 Home',
            },
            price: 1850000,
            media: {
                images: ['/images/asus-rog-strix.jpg'],
                videos: [],
            },
            featured: true,
        },
        {
            name: 'HP Spectre x360 14',
            brand: 'HP',
            category: 'Laptop',
            description: 'Premium 2-in-1 convertible laptop with stunning OLED display and elegant design.',
            specifications: {
                processor: 'Intel Core Ultra 7 155H',
                ram: '16GB LPDDR5',
                storage: '1TB PCIe Gen4 SSD',
                display: '14" 2.8K OLED Touch',
                battery: 'Up to 15 hours',
                weight: '1.44 kg',
                os: 'Windows 11 Home',
                ports: 'Thunderbolt 4, USB-A, microSD',
            },
            price: 980000,
            media: {
                images: ['/images/hp-spectre.jpg'],
                videos: [],
            },
            featured: true,
        },
        {
            name: 'Dell XPS 15',
            brand: 'Dell',
            category: 'Laptop',
            description: 'Stunning 15.6" InfinityEdge display in a compact form. Power meets portability.',
            specifications: {
                processor: 'Intel Core i7-13700H',
                ram: '16GB DDR5',
                storage: '512GB SSD',
                display: '15.6" FHD+ InfinityEdge',
                gpu: 'Intel Iris Xe Graphics',
                battery: 'Up to 13 hours',
                weight: '1.86 kg',
                os: 'Windows 11 Pro',
            },
            price: 750000,
            media: {
                images: ['/images/dell-xps-15.jpg'],
                videos: [],
            },
            featured: true,
        },
        {
            name: 'Lenovo ThinkPad X1 Carbon',
            brand: 'Lenovo',
            category: 'Laptop',
            description: 'The ultimate business ultrabook. Legendary reliability meets cutting-edge technology.',
            specifications: {
                processor: 'Intel Core i7-1365U',
                ram: '16GB LPDDR5',
                storage: '512GB SSD',
                display: '14" 2.8K OLED',
                battery: 'Up to 15 hours',
                weight: '1.12 kg',
                os: 'Windows 11 Pro',
                ports: '2x Thunderbolt 4, 2x USB-A, HDMI',
            },
            price: 920000,
            media: {
                images: ['/images/thinkpad-x1.jpg'],
                videos: [],
            },
            featured: true,
        },
        {
            name: 'MacBook Air 15" M3',
            brand: 'Apple',
            category: 'Laptop',
            description: 'Impossibly thin. Incredibly capable. 15 inches of stunning Liquid Retina display.',
            specifications: {
                processor: 'Apple M3 (8-core CPU, 10-core GPU)',
                ram: '16GB Unified Memory',
                storage: '256GB SSD',
                display: '15.3" Liquid Retina',
                battery: 'Up to 18 hours',
                weight: '1.51 kg',
                os: 'macOS Sonoma',
                ports: 'MagSafe 3, 2x Thunderbolt, 3.5mm jack',
            },
            price: 890000,
            media: {
                images: ['/images/macbook-air-15.jpg'],
                videos: [],
            },
            featured: false,
        },
        {
            name: 'Wireless Gaming Mouse Pro',
            brand: 'Elohimtech',
            category: 'Accessory',
            description: 'High-precision gaming mouse with customizable RGB and 25,000 DPI sensor.',
            specifications: {
                weight: '80g',
            },
            price: 35000,
            media: {
                images: ['/images/gaming-mouse.jpg'],
                videos: [],
            },
            featured: false,
        },
        {
            name: 'USB-C Hub 10-in-1',
            brand: 'Elohimtech',
            category: 'Accessory',
            description: 'All your connectivity needs in one sleek hub. HDMI, USB, SD cards, and more.',
            specifications: {
                ports: 'HDMI 4K, VGA, 3x USB 3.0, SD/TF, RJ45, 3.5mm Audio',
            },
            price: 28000,
            media: {
                images: ['/images/usb-hub.jpg'],
                videos: [],
            },
            featured: false,
        },
    ];

    for (const productData of products) {
        const product = new Product(productData);
        await product.save();

        // Create sample units for each product
        const unitCount = productData.category === 'Laptop' ? 2 : 3;
        for (let i = 0; i < unitCount; i++) {
            const unit = new Unit({
                productId: product._id,
                status: i === 0 ? 'available' : (i === 1 ? 'available' : 'coming_soon'),
            });
            await unit.save();
        }
    }

    console.log('✅ Sample products seeded');
}

// Connect to MongoDB and start server
mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elohimtech')
    .then(async () => {
        console.log('📦 Connected to MongoDB');

        await createDefaultAdmin();
        await seedProducts();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
    });

export default app;
