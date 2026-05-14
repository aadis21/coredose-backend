import { Request, Response } from 'express';
import User from '../models/User';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name price images slug ratings numReviews');
    if (user) {
      res.json(user.wishlist);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add to wishlist
// @route   POST /api/wishlist/add
// @access  Private
export const addToWishlist = async (req: any, res: Response) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      if (!user.wishlist.includes(productId)) {
        user.wishlist.push(productId);
        await user.save();
      }
      res.status(200).json({ message: 'Added to wishlist', wishlist: user.wishlist });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Remove from wishlist
// @route   DELETE /api/wishlist/item/:productId
// @access  Private
export const removeFromWishlist = async (req: any, res: Response) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    if (user) {
      user.wishlist = user.wishlist.filter((id: any) => id.toString() !== productId);
      await user.save();
      res.status(200).json({ message: 'Removed from wishlist', wishlist: user.wishlist });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Check if product in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
export const checkWishlist = async (req: any, res: Response) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const inWishlist = user.wishlist.some((id: any) => id.toString() === productId);
    res.json({ inWishlist });
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
export const clearWishlist = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.wishlist = [];
    await user.save();

    res.json({ message: 'Wishlist cleared', wishlist: user.wishlist });
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error' });
  }
};
