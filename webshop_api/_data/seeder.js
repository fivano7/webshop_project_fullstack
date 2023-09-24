const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');
const path = require('path');

//Load env vars
dotenv.config({
  path: path.join(__dirname, '..', 'src', 'config', 'config.env'),
});

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//Load models
const Cart = require('../src/models/Cart');
const CartItem = require('../src/models/CartItem');
const Category = require('../src/models/Category');
const DeliveryDetail = require('../src/models/DeliveryDetail');
const Faq = require('../src/models/Faq');
const Favourite = require('../src/models/Favourite');
const FavouriteItem = require('../src/models/FavouriteItem');
const FeaturedItem = require('../src/models/FeaturedItem');
const NewsletterSubscriber = require('../src/models/NewsletterSubscriber');
const Order = require('../src/models/Order');
const OrderItem = require('../src/models/OrderItem');
const OrderStatus = require('../src/models/OrderStatus');
const Product = require('../src/models/Product');
const Review = require('../src/models/Review');
const User = require('../src/models/User');

//Connect to DB
mongoose.connect(process.env.MONGO_DEV_URI);

//Read JSON files
const carts = JSON.parse(
  fs.readFileSync(`${__dirname}/json/carts.json`, 'utf-8')
);
const cartitems = JSON.parse(
  fs.readFileSync(`${__dirname}/json/cartitems.json`, 'utf-8')
);

const categories = JSON.parse(
  fs.readFileSync(`${__dirname}/json/categories.json`, 'utf-8')
);

const deliverydetails = JSON.parse(
  fs.readFileSync(`${__dirname}/json/deliverydetails.json`, 'utf-8')
);

const faqs = JSON.parse(
  fs.readFileSync(`${__dirname}/json/faqs.json`, 'utf-8')
);

const favourites = JSON.parse(
  fs.readFileSync(`${__dirname}/json/favourites.json`, 'utf-8')
);

const favouriteitems = JSON.parse(
  fs.readFileSync(`${__dirname}/json/favouriteitems.json`, 'utf-8')
);

const featureditem = JSON.parse(
  fs.readFileSync(`${__dirname}/json/featureditem.json`, 'utf-8')
);

const newslettersubscribers = JSON.parse(
  fs.readFileSync(`${__dirname}/json/newslettersubscribers.json`, 'utf-8')
);

const orders = JSON.parse(
  fs.readFileSync(`${__dirname}/json/orders.json`, 'utf-8')
);

const orderitems = JSON.parse(
  fs.readFileSync(`${__dirname}/json/orderitems.json`, 'utf-8')
);

const orderstatuses = JSON.parse(
  fs.readFileSync(`${__dirname}/json/orderstatuses.json`, 'utf-8')
);

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/json/products.json`, 'utf-8')
);

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/json/reviews.json`, 'utf-8')
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/json/users.json`, 'utf-8')
);

//Import into DB
const importData = async () => {
  try {
    await Category.create(categories);

    for (const productData of products) {
      const stripeProduct = await stripe.products.create({
        name: productData.name,
        description: productData.description,
      });

      const price = Math.round(productData.price * 100);

      const stripePrice = await stripe.prices.create({
        unit_amount: price,
        currency: 'eur',
        product: stripeProduct.id,
      });

      const createdProduct = await Product.create({
        ...productData,
        stripeProductId: stripeProduct.id,
        stripePriceId: stripePrice.id,
      });

      console.log(`Created product: ${createdProduct.name}`);
    }

    await Faq.create(faqs);
    await NewsletterSubscriber.create(newslettersubscribers);
    // await OrderStatus.create(orderstatuses);
    await FavouriteItem.create(favouriteitems);
    // await OrderItem.create(orderitems);
    await CartItem.create(cartitems);
    await FeaturedItem.create(featureditem);
    await Cart.create(carts);
    await Favourite.create(favourites);
    await User.create(users);
    await DeliveryDetail.create(deliverydetails);
    await Review.create(reviews);
    // await Order.create(orders);
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

//Delete data
const deleteData = async () => {
  try {
    await Cart.deleteMany();
    await CartItem.deleteMany();
    await Category.deleteMany();
    await DeliveryDetail.deleteMany();
    await Faq.deleteMany();
    await Favourite.deleteMany();
    await FavouriteItem.deleteMany();
    await FeaturedItem.deleteMany();
    await NewsletterSubscriber.deleteMany();
    await Order.deleteMany();
    await OrderItem.deleteMany();
    await OrderStatus.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    await User.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
