const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const OrderStatus = require('../models/OrderStatus');
const DeliveryDetail = require('../models/DeliveryDetail');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Cart = require('../models/Cart');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require('uuid');
const sendEmail = require('../utils/sendEmail');

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Public
exports.getOrders = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Public
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate({
    path: 'orderItems',
    populate: {
      path: 'product',
      model: 'Product',
    },
  }).populate('orderStatuses');

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with the id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: order });
});

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Public
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { userId, email, deliveryDetailId, cartId, paymentMethod } = req.body;

  const user = await User.findById(userId);
  if (user) {
    delete req.body.email;
  } else {
    if (email) {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return next(new ErrorResponse(`Please enter a valid email address`));
      }
    } else {
      return next(new ErrorResponse(`Please enter email address or userId`));
    }
  }

  const deliveryDetail = await DeliveryDetail.findById(deliveryDetailId);
  if (!deliveryDetail) {
    return next(
      new ErrorResponse(
        `Delivery detail not found with the id of ${deliveryDetailId}`
      )
    );
  }

  req.body.deliveryDetail = {
    country: deliveryDetail.country,
    city: deliveryDetail.city,
    postalCode: deliveryDetail.postalCode,
    street: deliveryDetail.street,
    firstName: deliveryDetail.firstName,
    lastName: deliveryDetail.lastName,
    phoneNumber: deliveryDetail.phoneNumber
  };

  const cart = await Cart.findById(cartId).populate({
    path: 'cartItems',
    populate: {
      path: 'product',
      model: 'Product',
    },
  });

  if (!cart) {
    return next(new ErrorResponse(`Cart not found with the id of ${cartId}`));
  }

  if (cart.cartItems.length < 1) {
    return next(new ErrorResponse(`Cart can't be empty`));
  }

  const orderItems = await Promise.all(
    cart.cartItems.map(async (cartItem) => {
      const orderItemData = {
        product: {
          name: cartItem.product.name,
          price: cartItem.product.price,
          discountPrice: cartItem.product.discountPrice,
          stripeProductId: cartItem.product.stripeProductId,
          stripePriceId: cartItem.product.stripePriceId,
        },
        quantity: cartItem.quantity,
      };

      return await OrderItem.create(orderItemData);
    })
  );
  req.body.orderItems = orderItems;

  req.body.orderStatuses = [
    await OrderStatus.create({
      status: 'Created',
      comment: 'Order created',
    }),
  ];

  req.body.orderId = uuidv4().split('-').join('').slice(0, 5).toUpperCase();
  let stripeOrder;
  if (paymentMethod === 'card') {
    try {
      stripeOrder = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: req.body.orderItems.map((orderItem) => {
          return {
            price: orderItem.product.stripePriceId,
            quantity: orderItem.quantity,
          };
        }),
        success_url: `${process.env.FRONTEND_URL}/checkout/success?orderId=${req.body.orderId}&paymentMethod=card`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout/failure`,
        metadata: {
          cartId
        }
      });
      req.body.stripeOrderId = stripeOrder.id;
    } catch (error) {
      return next(
        new ErrorResponse(
          `Error creating Stripe order. Please try again or contact support. ${error}`
        )
      );
    }
  } else if (paymentMethod === 'cash') {
    await cart.clearCartItems();
  }

  let order = await Order.create({
    ...req.body,
    user: userId,
  });
  if (stripeOrder) {
    res.status(201).json({
      success: true,
      data: {
        order,
        stripeUrl: stripeOrder.url,
      },
    });
    return;
  }
  res.status(201).json({ success: true, data: { order } });
});

// @desc    Webhook to confirm payment
// @route   POST /api/v1/orders/stripe
// @access  Public
exports.stripeWebhook = asyncHandler(async (req, res, next) => {
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_ENDPOINT_SECRET
    );

    const cartId = event.data.object.metadata.cartId
    const stripeOrderId = event.data.object.id
    const email = event.data.object.customer_details.email
    const paymentIntentId = event.data.object.payment_intent
    const stripeReceiptUrl = (await stripe.charges.list({ payment_intent: paymentIntentId })).data[0].receipt_url;

    const subject = 'Your order on Webshop';
    const message = `Thank you for ordering products on our website: <p><a href="${stripeReceiptUrl}" style="display: inline-block; background-color: #007bff; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Receipt</a></p>`;

    switch (event.type) {
      case 'checkout.session.completed':
        await sendEmail({
          email,
          subject,
          message,
        });
        const orderStatus = await OrderStatus.create({ status: "Paid with Stripe", comment: "Your order is paid using Stripe" })
        await Order.findOneAndUpdate({ stripeOrderId }, { $push: { orderStatuses: orderStatus._id }, stripeReceiptUrl, isPaid: true })
        if (cartId) {
          const cart = await Cart.findById(cartId);
          await cart.clearCartItems();
        }
        break;
      default:
        console.log(`Event ${event.type} is not handled`)
    }

    res.send();
  } catch (err) {
    const orderStatus = await OrderStatus.create({ status: "Error with payment", comment: "There was an error with your stripe payment" })
    await Order.findOneAndUpdate({ stripeOrderId }, { $push: { orderStatuses: orderStatus._id }, isPaid: false })
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// @desc    Update order
// @route   PUT /api/v1/orders/:id
// @access  Public
exports.updateOrder = asyncHandler(async (req, res, next) => {
  const { isPaid } = req.body;

  let order = await Order.findById(req.params.id).populate({
    path: 'orderItems',
    populate: {
      path: 'product',
      model: 'Product',
    },
  }).populate('orderStatuses');
  
  if (!order) {
    return next(new ErrorResponse(`Order not found with the id of ${req.params.id}`, 404));
  }

  if (isPaid !== undefined) {
    if (isPaid === order.isPaid) {
      return next(new ErrorResponse(`Order has already been marked as ${isPaid ? "paid" : "not paid"}`, 400));
    }

    const orderStatus = await OrderStatus.create({
      status: `Order ${isPaid ? 'paid' : 'not paid'}`,
      comment: `Order is marked as ${isPaid ? 'paid' : 'not paid'}`,
    });

    order.orderStatuses.push(orderStatus);
    order.isPaid = isPaid;
  }

  order = await order.save();

  res.status(200).json({ success: true, data: order });
});


// @desc    Delete order
// @route   DELETE /api/v1/orders/:id
// @access  Public
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ErrorResponse(`Order not found with the id of ${req.params.id}`, 404)
    );
  }

  await order.deleteOne();

  res.status(200).json({ success: true, data: {} });
});

// @desc    Cancel order
// @route   PUT /api/v1/orders/:id/cancel
// @access  Public
exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('orderItems')
    .populate('orderStatuses')
    .populate("user");

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with the id of ${req.params.id}`, 404)
    );
  }

  if (order.isCancelled) {
    return next(
      new ErrorResponse(`Order has already been cancelled`, 404)
    );
  }

  const orderStatus = await OrderStatus.create({
    status: 'Cancelled',
    comment: 'Order is cancelled',
  })

  order.orderStatuses.push(orderStatus);
  order.isCancelled = true;
  await order.save();

  const email = order.email ? order.email : order.user.email
  const subject = "Order cancellation"
  const message = `<html lang="en"><head><style> body {font-family: Arial, sans-serif; background-color: white; color: black; text-align: center; } .container { width:85%; border: 4px solid black; padding: 20px; display: inline-block; } .button { display: inline-block; background-color: black; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; }    </style>  </head>  <body>    <div class="container"> <h1>Smith Pottery | Webshop</h1> <p> Your order #${order.orderId} has been cancelled. </p></div></body></html>`
  try {
    await sendEmail({
      email,
      subject,
      message,
    });

    res.status(200).json({ success: true, data: order });

  } catch (err) {
    return next(new ErrorResponse('Error cancelling order', 500));
  }
});