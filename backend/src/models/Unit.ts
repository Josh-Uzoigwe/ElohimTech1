import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IUnit extends Document {
    productId: mongoose.Types.ObjectId;
    uniqueTag: string;
    status: 'available' | 'taken' | 'coming_soon';
    createdAt: Date;
    updatedAt: Date;
}

// Generate 6-character alphanumeric tag
function generateUniqueTag(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let tag = '';
    for (let i = 0; i < 6; i++) {
        tag += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return tag;
}

const UnitSchema: Schema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    uniqueTag: {
        type: String,
        unique: true,
        default: generateUniqueTag
    },
    status: {
        type: String,
        enum: ['available', 'taken', 'coming_soon'],
        default: 'available'
    },
}, {
    timestamps: true,
});

// Ensure unique tag on save
UnitSchema.pre('save', async function (next) {
    if (this.isNew && !this.uniqueTag) {
        let isUnique = false;
        while (!isUnique) {
            const tag = generateUniqueTag();
            const existing = await mongoose.model('Unit').findOne({ uniqueTag: tag });
            if (!existing) {
                this.uniqueTag = tag;
                isUnique = true;
            }
        }
    }
    next();
});

export default mongoose.model<IUnit>('Unit', UnitSchema);
