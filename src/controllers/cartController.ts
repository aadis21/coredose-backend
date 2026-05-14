import { Request, Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req: any, res: Response): Promise<void> => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product', 'name price images slug');
    
    if (!cart) {
      cart = new Cart({ user: req.user._id, cartItems: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req: any, res: Response): Promise<void> => {
  const { productId, qty = 1 } = req.body;

  try {
    const product = await Product.findById(productId);
    
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        cartItems: [{
          product: productId,
          name: product.name,
          qty,
          price: product.price,
          image: product.images?.[0] || product.image,
        }],
      });
    } else {
      const existingItem = cart.cartItems.find(item => item.product.toString() === productId);
      
      if (existingItem) {
        existingItem.qty += qty;
      } else {
        cart.cartItems.push({
          product: productId,
          name: product.name,
          qty,
          price: product.price,
          image: product.images?.[0] || product.image,
        });
      }
    }

    await cart.save();
    const populatedCart = await cart.populate('cartItems.product', 'name price images slug');
    
    res.json(populatedCart);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/item/:productId
// @access  Private
export const updateCartItem = async (req: any, res: Response): Promise<void> => {
  const { qty } = req.body;
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    const item = cart.cartItems.find(item => item.product.toString() === productId);

    if (!item) {
      res.status(404).json({ message: 'Item not in cart' });
      return;
    }

    if (qty <= 0) {
      cart.cartItems = cart.cartItems.filter(item => item.product.toString() !== productId);
    } else {
      item.qty = qty;
    }

    await cart.save();
    const populatedCart = await cart.populate('cartItems.product', 'name price images slug');

    res.json(populatedCart);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/item/:productId
// @access  Private
export const removeFromCart = async (req: any, res: Response): Promise<void> => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    cart.cartItems = cart.cartItems.filter(item => item.product.toString() !== productId);
    
    await cart.save();
    const populatedCart = await cart.populate('cartItems.product', 'name price images slug');

    res.json(populatedCart);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req: any, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    cart.cartItems = [];
    await cart.save();

    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error' });
  }
};
