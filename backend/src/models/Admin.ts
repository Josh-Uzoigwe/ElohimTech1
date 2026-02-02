import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
    email: string;
    password: string;
    name: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
}, {
    timestamps: true,
});

// Hash password before saving
AdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
});

// Compare password method
AdminSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IAdmin>('Admin', AdminSchema);
