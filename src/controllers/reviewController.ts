import { Request, Response } from 'express';
import Review from '../models/Review';
import Product from '../models/Product';

export const createProductReview = async (req: any, res: Response) => {
  const { rating, comment, productId } = req.body;

  const product = await Product.findById(productId);

  if (product) {
    const alreadyReviewed = await Review.findOne({ user: req.user._id, product: productId });

    if (alreadyReviewed) {
      res.status(400).json({ message: 'Product already reviewed' });
      return;
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      comment,
    });

    // Update product overall rating
    const allReviews = await Review.find({ product: productId });
    product.numReviews = allReviews.length;
    product.ratings = allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;
    
    await product.save();
    res.status(201).json(review);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};
