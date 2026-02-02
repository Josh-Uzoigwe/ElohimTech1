import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IOrder extends Document {
    unitTag: string;
    productName: string;
    customerName: string;
    customerPhone?: string;
    customerEmail?: string;
    price: number;
    receiptId: string;
    status: 'pending' | 'confirmed' | 'completed';
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
    unitTag: { type: String, required: true },
    productName: { type: String, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String },
    customerEmail: { type: String },
    price: { type: Number, required: true },
    receiptId: {
        type: String,
        unique: true,
        default: () => `RCP-${uuidv4().slice(0, 8).toUpperCase()}`
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed'],
        default: 'confirmed'
    },
    notes: { type: String },
}, {
    timestamps: true,
});

export default mongoose.model<IOrder>('Order', OrderSchema);
