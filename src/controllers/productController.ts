import { Request, Response } from 'express';
import Product from '../models/Product';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch single product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: any, res: Response) => {
  console.log('POST /api/products reached');
  try {
    const {
      name,
      price,
      description,
      image,
      images,
      brand,
      category,
      stock,
      slug,
      ingredients,
      flavors,
      badges,
      isFeatured,
    } = req.body;

    const product = new Product({
      name: name || 'New Product',
      price: price || 0,
      user: req.user._id,
      image: image || '/images/placeholder.jpg',
      brand: brand || 'CoreDose',
      category: category || undefined,
      stock: stock || 0,
      description: description || 'No description',
      slug: slug || `product-${Date.now()}`,
      images: images || [],
      ingredients: ingredients || [],
      flavors: flavors || [],
      badges: badges || [],
      isFeatured: isFeatured || false,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('CREATE PRODUCT ERROR:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      price,
      description,
      image,
      images,
      brand,
      category,
      stock,
      slug,
      ingredients,
      flavors,
      badges,
      isFeatured,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name ?? product.name;
      product.price = price ?? product.price;
      product.description = description ?? product.description;
      product.image = image ?? product.image;
      product.images = images ?? product.images;
      product.brand = brand ?? product.brand;
      product.category = category ?? product.category;
      product.stock = stock ?? product.stock;
      product.slug = slug ?? product.slug;
      product.ingredients = ingredients ?? product.ingredients;
      product.flavors = flavors ?? product.flavors;
      product.badges = badges ?? product.badges;
      product.isFeatured = isFeatured ?? product.isFeatured;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
