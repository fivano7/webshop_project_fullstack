const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
    trim: true,
  },
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderItem',
      required: true,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  deliveryDetail: {
    country: {
      type: String,
      required: [true, 'Please add country'],
    },
    city: {
      type: String,
      required: [true, 'Please add city'],
    },
    postalCode: {
      type: String,
      required: [true, 'Please add postal code'],
    },
    street: {
      type: String,
      required: [true, 'Please add street'],
    },
    firstName: {
      type: String,
      required: [true, 'Please add first name'],
    },
    lastName: {
      type: String,
      required: [true, 'Please add last name'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please add a phone number'],
    },
  },
  orderId: {
    type: String,
    unique: true,
  },
  stripeOrderId: {
    type: String,
  },
  stripeReceiptUrl: {
    type: String,
  },
  isCancelled: {
    type: Boolean,
    default: false,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  orderStatuses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderStatus',
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

OrderSchema.statics.calculateTotalPrice = async function (orderItems) {
  let totalPrice = 0;

  for (const orderItem of orderItems) {
    if (orderItem && orderItem.product) {
      const { quantity, product } = orderItem;
      const unitPrice =
        product.discountPrice !== 0 ? product.discountPrice : product.price;
      totalPrice += quantity * unitPrice;
    }
  }

  return totalPrice;
};

OrderSchema.pre('save', async function () {
  this.totalPrice = await this.constructor.calculateTotalPrice(this.orderItems);
});

OrderSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    if (this.orderItems && this.orderItems.length > 0) {
      await mongoose.model('OrderItem').deleteMany({
        _id: { $in: this.orderItems },
      });
    }

    if (this.orderStatuses && this.orderStatuses.length > 0) {
      await mongoose.model('OrderStatus').deleteMany({
        _id: { $in: this.orderStatuses },
      });
    }

    next();
  }
);

module.exports = mongoose.model('Order', OrderSchema);
