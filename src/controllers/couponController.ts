import { Request, Response } from 'express';
import Coupon from '../models/Coupon';

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Public
export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    if (!code) {
      res.status(400).json({ message: 'Coupon code is required' });
      return;
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (coupon && coupon.isActive && new Date() < coupon.expiryDate) {
      res.json({ discountPercentage: coupon.discountPercentage });
    } else {
      res.status(400).json({ message: 'Invalid or expired coupon' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error validating coupon', error: error.message });
  }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find({});
    res.json(coupons);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching coupons', error: error.message });
  }
};

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req: Request, res: Response) => {
  try {
    const { code, discountPercentage, expiryDate, isActive } = req.body;

    if (!code || !discountPercentage || !expiryDate) {
      res.status(400).json({ message: 'Missing required coupon fields' });
      return;
    }

    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });

    if (couponExists) {
      res.status(400).json({ message: 'Coupon code already exists' });
      return;
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      discountPercentage,
      expiryDate,
      isActive: isActive !== undefined ? isActive : true,
    });

    const createdCoupon = await coupon.save();
    res.status(201).json(createdCoupon);
  } catch (error: any) {
    console.error('CREATE COUPON ERROR:', error);
    res.status(500).json({ message: 'Error creating coupon', error: error.message });
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
      await Coupon.findByIdAndDelete(req.params.id);
      res.json({ message: 'Coupon removed' });
    } else {
      res.status(404).json({ message: 'Coupon not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting coupon', error: error.message });
  }
};
