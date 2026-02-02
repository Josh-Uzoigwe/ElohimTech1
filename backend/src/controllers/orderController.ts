import { Request, Response } from 'express';
import { Order, Unit, Product } from '../models';

// Confirm sale and create receipt
export const confirmSale = async (req: Request, res: Response) => {
    try {
        const { unitTag, customerName, customerPhone, customerEmail, notes } = req.body;

        // Find and update unit
        const unit = await Unit.findOne({ uniqueTag: unitTag.toUpperCase() });
        if (!unit) {
            return res.status(404).json({ message: 'Unit not found' });
        }

        if (unit.status === 'taken') {
            return res.status(400).json({ message: 'Unit already sold' });
        }

        const product = await Product.findById(unit.productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Mark unit as taken
        unit.status = 'taken';
        await unit.save();

        // Create order/receipt
        const order = new Order({
            unitTag: unit.uniqueTag,
            productName: product.name,
            customerName,
            customerPhone,
            customerEmail,
            price: product.price,
            notes,
            status: 'confirmed',
        });

        await order.save();

        res.status(201).json({
            message: 'Sale confirmed',
            receipt: {
                receiptId: order.receiptId,
                productName: order.productName,
                unitTag: order.unitTag,
                customerName: order.customerName,
                price: order.price,
                date: order.createdAt,
                status: order.status,
            },
        });
    } catch (error) {
        console.error('Confirm sale error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get receipt by ID
export const getReceipt = async (req: Request, res: Response) => {
    try {
        const order = await Order.findOne({ receiptId: req.params.id });
        if (!order) {
            return res.status(404).json({ message: 'Receipt not found' });
        }

        res.json({
            receiptId: order.receiptId,
            productName: order.productName,
            unitTag: order.unitTag,
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            customerEmail: order.customerEmail,
            price: order.price,
            date: order.createdAt,
            status: order.status,
            notes: order.notes,
        });
    } catch (error) {
        console.error('Get receipt error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all orders
export const getOrders = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
        const filter: any = {};
        if (status) filter.status = status;

        const orders = await Order.find(filter).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const order = await Order.findOneAndUpdate(
            { receiptId: req.params.id },
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
