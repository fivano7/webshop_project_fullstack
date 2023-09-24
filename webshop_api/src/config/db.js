const mongoose = require('mongoose');

const connectDB = async () => {
  let mongoURI = process.env.MONGO_DEV_URI;

  if (process.env.NODE_ENV === 'production') {
    mongoURI = process.env.MONGO_PRO_URI;
  }

  const conn = await mongoose.connect(mongoURI);

  console.log(
    `MongoDB Connected (webshop_${process.env.NODE_ENV}): ${conn.connection.host}`.cyan
      .underline.bold
  );
};

module.exports = connectDB;
