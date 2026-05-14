import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User';
import Product from './models/Product';
import Category from './models/Category';
import Order from './models/Order';
import Review from './models/Review';
import Coupon from './models/Coupon';
import Notification from './models/Notification';
import connectDB from './config/db';

dotenv.config();
connectDB();

const categoriesList = [
  'Creatine', 'Whey Protein', 'Pre Workout', 'Mass Gainer', 'BCAA/EAA', 
  'Vitamins', 'Fish Oil', 'Testosterone Support', 'Wellness', 'Hydration', 
  'Recovery', 'Performance Stack', 'Strength Stack', 'Accessories'
];

const adjectives = ['Pro', 'Elite', 'Max', 'Ultra', 'Extreme', 'Advanced', 'Core', 'Premium', 'Ignite', 'Surge'];
const flavors = ['Unflavored', 'Chocolate Fudge', 'Vanilla Bean', 'Strawberry Burst', 'Blue Raspberry', 'Fruit Punch', 'Watermelon'];

const generateProducts = (categoryId: string, categoryName: string, adminId: string) => {
  const products = [];
  for (let i = 1; i <= 20; i++) {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const flavor = flavors[Math.floor(Math.random() * flavors.length)];
    const price = Math.floor(Math.random() * 80) + 19.99;
    
    products.push({
      user: adminId,
      name: `${categoryName} ${adj} ${i}`,
      slug: `${categoryName.toLowerCase().replace(/ /g, '-')}-${adj.toLowerCase()}-${i}`,
      image: '/images/placeholder.jpg',
      images: ['/images/placeholder.jpg'],
      brand: 'CoreDose',
      category: categoryId,
      description: `Premium ${categoryName} designed for extreme athletes. Scientifically dosed with 100% transparency. Contains highly bioavailable ingredients to maximize your performance and recovery.`,
      ingredients: [`Pure ${categoryName}`, 'Natural and Artificial Flavors', 'Sucralose'],
      price: Number(price.toFixed(2)),
      stock: Math.floor(Math.random() * 100) + 10,
      countInStock: Math.floor(Math.random() * 100) + 10,
      ratings: Number((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
      numReviews: Math.floor(Math.random() * 200) + 10,
      flavors: [flavor, flavors[Math.floor(Math.random() * flavors.length)]],
      badges: Math.random() > 0.8 ? ['Best Seller'] : [],
    });
  }
  return products;
};

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();
    await Review.deleteMany();
    await Coupon.deleteMany();
    await Notification.deleteMany();

    const passwordHash = await bcrypt.hash('123456', 10);

    const createdUsers = await User.insertMany([
      { firstName: 'Super', lastName: 'Admin', email: 'superadmin@coredose.com', passwordHash, role: 'superadmin' },
      { firstName: 'Store', lastName: 'Admin', email: 'admin@coredose.com', passwordHash, role: 'admin' },
      { firstName: 'John', lastName: 'Doe', email: 'john@example.com', passwordHash, role: 'customer' },
      { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', passwordHash, role: 'customer' },
    ]);

    const adminUser = createdUsers[0]._id;
    const customerUser = createdUsers[2]._id;

    // Create Categories
    const categoryDocs = await Category.insertMany(
      categoriesList.map(name => ({
        name,
        slug: name.toLowerCase().replace(/ \//g, '-').replace(/ /g, '-'),
        description: `Premium CoreDose ${name} supplements.`,
      }))
    );

    // Create Products programmatically (20 per category)
    let allProducts: any[] = [];
    categoryDocs.forEach(cat => {
      const catProducts = generateProducts(cat._id.toString(), cat.name, adminUser.toString());
      allProducts = [...allProducts, ...catProducts];
    });

    const insertedProducts = await Product.insertMany(allProducts);

    // Create 300+ Reviews randomly
    const reviews = [];
    for(let i=0; i<300; i++) {
       const randomProduct = insertedProducts[Math.floor(Math.random() * insertedProducts.length)];
       reviews.push({
         user: customerUser,
         product: randomProduct._id,
         rating: 5,
         comment: "Absolutely amazing product! CoreDose never misses. The transparency and dosing are exactly what I need."
       });
    }
    await Review.insertMany(reviews);

    // Create Coupons
    await Coupon.insertMany([
      { code: 'CORE20', discountPercentage: 20, isActive: true, expiryDate: new Date('2026-12-31') },
      { code: 'WELCOME10', discountPercentage: 10, isActive: true, expiryDate: new Date('2027-01-01') },
    ]);

    // Create Notifications
    await Notification.insertMany([
      { user: customerUser, title: 'Welcome to CoreDose', message: 'Use code WELCOME10 for 10% off.' },
      { user: customerUser, title: 'Order Shipped', message: 'Your latest order has been shipped.' },
    ]);

    console.log('Data Imported successfully into MongoDB Atlas!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();
    await Review.deleteMany();
    await Coupon.deleteMany();
    await Notification.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
