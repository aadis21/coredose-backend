import { Request, Response } from 'express';
import User from '../models/User';
import Order from '../models/Order';
import Product from '../models/Product';

// @desc    Get all users (Superadmin only)
// @route   GET /api/admin/users
// @access  Private/Superadmin
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('-passwordHash');
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Superadmin
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === 'superadmin') {
        res.status(400).json({ message: 'Cannot delete superadmin user' });
        return;
      }
      await User.findByIdAndDelete(user._id);
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Superadmin
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.role = req.body.role || user.role;
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating role', error: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [totalOrders, totalProducts, totalUsers] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
    ]);

    const revenueResult = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const monthlySales = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$totalPrice' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'firstName lastName');

    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .limit(5);

    res.json({
      stats: {
        totalRevenue: revenueResult[0]?.total || 0,
        totalOrders,
        totalUsers,
        totalProducts
      },
      monthlySales,
      recentOrders,
      lowStockProducts
    });
  } catch (error: any) {
    console.error('STATS ERROR:', error);
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};
