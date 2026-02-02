import { Request, Response } from 'express';
import { Unit, Product } from '../models';

// Create new unit/tag for a product
export const createUnit = async (req: Request, res: Response) => {
    try {
        const { productId, status } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const unit = new Unit({
            productId,
            status: status || 'available',
        });

        await unit.save();

        res.status(201).json({
            id: unit._id,
            tag: unit.uniqueTag,
            status: unit.status,
            productName: product.name,
        });
    } catch (error) {
        console.error('Create unit error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get units for a product
export const getProductUnits = async (req: Request, res: Response) => {
    try {
        const units = await Unit.find({ productId: req.params.productId })
            .populate('productId', 'name brand price');
        res.json(units);
    } catch (error) {
        console.error('Get units error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update unit status
export const updateUnitStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const { tag } = req.params;

        const unit = await Unit.findOne({ uniqueTag: tag.toUpperCase() });
        if (!unit) {
            return res.status(404).json({ message: 'Unit not found' });
        }

        unit.status = status;
        await unit.save();

        res.json({
            id: unit._id,
            tag: unit.uniqueTag,
            status: unit.status,
        });
    } catch (error) {
        console.error('Update unit error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get unit by tag
export const getUnitByTag = async (req: Request, res: Response) => {
    try {
        const unit = await Unit.findOne({ uniqueTag: req.params.tag.toUpperCase() })
            .populate('productId', 'name brand price media');

        if (!unit) {
            return res.status(404).json({ message: 'Unit not found' });
        }

        res.json(unit);
    } catch (error) {
        console.error('Get unit error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete unit
export const deleteUnit = async (req: Request, res: Response) => {
    try {
        const unit = await Unit.findOneAndDelete({ uniqueTag: req.params.tag.toUpperCase() });
        if (!unit) {
            return res.status(404).json({ message: 'Unit not found' });
        }
        res.json({ message: 'Unit deleted' });
    } catch (error) {
        console.error('Delete unit error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all units (admin)
export const getAllUnits = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
        const filter: any = {};
        if (status) filter.status = status;

        const units = await Unit.find(filter)
            .populate('productId', 'name brand price')
            .sort({ createdAt: -1 });

        res.json(units);
    } catch (error) {
        console.error('Get all units error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
