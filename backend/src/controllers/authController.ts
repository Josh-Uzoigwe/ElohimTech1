import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../models';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const secret = process.env.JWT_SECRET || 'fallback-secret';
        const token = jwt.sign(
            { id: admin._id.toString() },
            secret,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getProfile = async (req: Request & { adminId?: string }, res: Response) => {
    try {
        const admin = await Admin.findById(req.adminId).select('-password');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json(admin);
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const changePassword = async (req: Request & { adminId?: string }, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        const admin = await Admin.findById(req.adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const isMatch = await admin.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        admin.password = newPassword;
        await admin.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
