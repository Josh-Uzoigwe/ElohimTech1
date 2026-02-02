import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    brand: string;
    category: 'Laptop' | 'Accessory';
    description: string;
    specifications: {
        processor?: string;
        ram?: string;
        storage?: string;
        display?: string;
        gpu?: string;
        battery?: string;
        weight?: string;
        os?: string;
        ports?: string;
    };
    price: number;
    media: {
        images: string[];
        videos: string[];
    };
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, enum: ['Laptop', 'Accessory'], required: true },
    description: { type: String, required: true },
    specifications: {
        processor: String,
        ram: String,
        storage: String,
        display: String,
        gpu: String,
        battery: String,
        weight: String,
        os: String,
        ports: String,
    },
    price: { type: Number, required: true },
    media: {
        images: [{ type: String }],
        videos: [{ type: String }],
    },
    featured: { type: Boolean, default: false },
}, {
    timestamps: true,
});

export default mongoose.model<IProduct>('Product', ProductSchema);
