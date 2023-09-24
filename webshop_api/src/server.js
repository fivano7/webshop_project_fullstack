const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const colors = require('colors');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//Load env vars
dotenv.config({
  path: path.join(__dirname, 'config', 'config.env'),
});

// Connect to database
connectDB();

//Route files
const categories = require('./routers/categories');
const faqs = require('./routers/faqs');
const newslettersubscribers = require('./routers/newslettersubscribers');
const products = require('./routers/products');
const featureditem = require('./routers/featureditem');
const favourites = require('./routers/favourites');
const reviews = require('./routers/reviews');
const carts = require('./routers/carts');
const users = require('./routers/users');
const deliverydetails = require('./routers/deliverydetails');
const orderstatuses = require('./routers/orderstatuses');
const orders = require('./routers/orders');
const auth = require('./routers/auth');
const { stripeWebhook } = require('./controllers/orders');

//Init express app
const app = express();

// Raw body for Stripe webhook (before app.use(express.json()))
app.post(
  '/api/v1/orders/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//File upload
app.use(fileUpload());

//SQL Injection prevention
app.use(mongoSanitize());

//Set security headers
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

//Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 100, //1 min
  max: 10000, //max number of request
});

app.use(limiter);

//Prevent HTTP param pollution
app.use(hpp());

//Enable CORS
app.use(cors());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount routers
app.use('/api/v1/categories', categories);
app.use('/api/v1/faqs', faqs);
app.use('/api/v1/newslettersubscribers', newslettersubscribers);
app.use('/api/v1/products', products);
app.use('/api/v1/featureditem', featureditem);
app.use('/api/v1/favourites', favourites);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/carts', carts);
app.use('/api/v1/users', users);
app.use('/api/v1/deliverydetails', deliverydetails);
app.use('/api/v1/orderstatuses', orderstatuses);
app.use('/api/v1/orders', orders);
app.use('/api/v1/auth', auth);

//Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`ERROR: ${err.message}`.red.bold);

  //Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;
