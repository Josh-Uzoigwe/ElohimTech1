import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Admin, Product } from './models';

dotenv.config();

const seedData = async () => {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/elohimtech';
        await mongoose.connect(mongoUri);
        console.log('📦 Connected to MongoDB Atlas');

        // Clear existing data
        await Admin.deleteMany({});
        await Product.deleteMany({});
        console.log('🗑️ Cleared existing data');

        // Create Admin
        const admin = await Admin.create({
            email: 'admin@elohimtech.com',
            password: 'Admin@123',
            name: 'Elohimtech Admin',
        });
        console.log('✅ Admin created:', admin.email);

        // Create Sample Products
        const products = await Product.create([
            {
                name: 'MacBook Pro 14" M3',
                brand: 'Apple',
                category: 'Laptop',
                price: 1850000,
                description: 'Apple M3 chip, 14-inch Liquid Retina XDR display, 18GB unified memory, 512GB SSD storage. Space Black finish.',
                images: ['/products/macbook-pro-14.jpg'],
                specs: {
                    processor: 'Apple M3 Pro',
                    ram: '18GB Unified Memory',
                    storage: '512GB SSD',
                    display: '14.2" Liquid Retina XDR',
                    battery: 'Up to 17 hours'
                },
                featured: true,
            },
            {
                name: 'Dell XPS 15',
                brand: 'Dell',
                category: 'Laptop',
                price: 1450000,
                description: 'Intel Core i7-13700H, 15.6" OLED 3.5K display, 16GB RAM, 512GB SSD. Premium ultrabook design.',
                images: ['/products/dell-xps-15.jpg'],
                specs: {
                    processor: 'Intel Core i7-13700H',
                    ram: '16GB DDR5',
                    storage: '512GB NVMe SSD',
                    display: '15.6" OLED 3.5K',
                    battery: 'Up to 13 hours'
                },
                featured: true,
            },
            {
                name: 'HP Spectre x360',
                brand: 'HP',
                category: 'Laptop',
                price: 1250000,
                description: '2-in-1 convertible laptop with Intel Core i7, 16GB RAM, 1TB SSD, and stunning OLED touchscreen display.',
                images: ['/products/hp-spectre-x360.jpg'],
                specs: {
                    processor: 'Intel Core i7-1360P',
                    ram: '16GB DDR5',
                    storage: '1TB SSD',
                    display: '13.5" OLED Touch',
                    battery: 'Up to 15 hours'
                },
                featured: true,
            },
            {
                name: 'ASUS ROG Strix G16',
                brand: 'ASUS',
                category: 'Laptop',
                price: 1650000,
                description: 'Gaming powerhouse with Intel Core i9, RTX 4070, 16GB RAM, and 240Hz display for ultimate gaming experience.',
                images: ['/products/asus-rog-strix-g16.jpg'],
                specs: {
                    processor: 'Intel Core i9-13980HX',
                    ram: '16GB DDR5',
                    storage: '1TB SSD',
                    display: '16" QHD 240Hz',
                    graphics: 'NVIDIA RTX 4070'
                },
                featured: true,
            },
            {
                name: 'Lenovo ThinkPad X1 Carbon',
                brand: 'Lenovo',
                category: 'Laptop',
                price: 1550000,
                description: 'Business ultrabook with Intel Core i7, 32GB RAM, 1TB SSD. Legendary ThinkPad reliability and keyboard.',
                images: ['/products/lenovo-thinkpad-x1.jpg'],
                specs: {
                    processor: 'Intel Core i7-1365U',
                    ram: '32GB LPDDR5',
                    storage: '1TB SSD',
                    display: '14" 2.8K OLED',
                    battery: 'Up to 15 hours'
                },
                featured: false,
            },
            {
                name: 'MacBook Air 15" M2',
                brand: 'Apple',
                category: 'Laptop',
                price: 1350000,
                description: 'Incredibly thin and light with M2 chip, 15.3-inch Liquid Retina display, all-day battery life.',
                images: ['/products/macbook-air-15.jpg'],
                specs: {
                    processor: 'Apple M2',
                    ram: '8GB Unified Memory',
                    storage: '256GB SSD',
                    display: '15.3" Liquid Retina',
                    battery: 'Up to 18 hours'
                },
                featured: false,
            },
            {
                name: 'Logitech MX Master 3S',
                brand: 'Logitech',
                category: 'Accessory',
                price: 85000,
                description: 'Premium wireless mouse with MagSpeed scrolling, 8K DPI sensor, and quiet clicks. Perfect for productivity.',
                images: ['/products/gaming-mouse.jpg'],
                specs: {
                    connectivity: 'Bluetooth + USB Receiver',
                    battery: '70 days on full charge',
                    dpi: '8000 DPI'
                },
                featured: false,
            },
            {
                name: 'Anker USB-C Hub 7-in-1',
                brand: 'Anker',
                category: 'Accessory',
                price: 45000,
                description: 'Expand your laptop connectivity with HDMI 4K, USB-A, USB-C, SD card reader, and 100W Power Delivery.',
                images: ['/products/usb-c-hub.jpg'],
                specs: {
                    ports: '7 ports total',
                    powerDelivery: '100W pass-through',
                    hdmi: '4K@60Hz output'
                },
                featured: false,
            },
        ]);

        console.log(`✅ Created ${products.length} products`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📋 Admin Credentials:');
        console.log('   Email: admin@elohimtech.com');
        console.log('   Password: Admin@123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seedData();
