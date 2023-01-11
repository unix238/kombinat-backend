const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const cors = require('cors');

const AuthRouter = require('./routers/auth-router');
const NewsRouter = require('./routers/news-router');
const ItemRouter = require('./routers/item-router');
const PaymentRouter = require('./routers/payment-router');
const CMSAuthRouter = require('./routers/cms/auth-router');

const app = express();
// config
app.use(cors());
app.use(express.json());

// Routers
app.use('/auth', AuthRouter);
app.use('/news', NewsRouter);
app.use('/items', ItemRouter);
app.use('/payments', PaymentRouter);

//CMS Routers
app.use('/cms/auth', CMSAuthRouter);

const start = async () => {
  try {
    connectToDatabase();
    app.listen(config.PORT, () => {
      console.log(`app started on port ${config.PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.DB_URL);
    console.log('connected to database');
  } catch (e) {
    console.log('Error connecting to MongoDB');
    console.log(e);
    console.log('----------------------------');
  }
};

start();
