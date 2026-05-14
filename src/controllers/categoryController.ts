import { Request, Response } from 'express';
import Category from '../models/Category';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, image } = req.body;

    if (!name || !slug) {
      res.status(400).json({ message: 'Name and Slug are required' });
      return;
    }

    const categoryExists = await Category.findOne({ slug });

    if (categoryExists) {
      res.status(400).json({ message: 'Category with this slug already exists' });
      return;
    }

    const category = await Category.create({ name, slug, description, image });
    res.status(201).json(category);
  } catch (error: any) {
    console.error('CREATE CATEGORY ERROR:', error);
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, image } = req.body;
    const category = await Category.findById(req.params.id);

    if (category) {
      category.name = name ?? category.name;
      category.slug = slug ?? category.slug;
      category.description = description ?? category.description;
      category.image = image ?? category.image;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error: any) {
    console.error('UPDATE CATEGORY ERROR:', error);
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      await Category.findByIdAndDelete(req.params.id);
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error: any) {
    console.error('DELETE CATEGORY ERROR:', error);
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};
