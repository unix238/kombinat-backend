const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');

const AuthRouter = require('./routers/auth-router');
const NewsRouter = require('./routers/news-router');
const ItemRouter = require('./routers/item-router');
const PaymentRouter = require('./routers/payment-router');

// CMS Routers
const CMSAuthRouter = require('./routers/cms/auth-router');
const CMSOrdersRouter = require('./routers/cms/orders-router');
const CMSItemRouter = require('./routers/cms/item-router');

const app = express();

// config
app.use(cors());
// setup cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(bodyParser.text({ limit: '30mb' }));
app.use(express.json());

// Routers
app.use('/auth', AuthRouter);
app.use('/news', NewsRouter);
app.use('/items', ItemRouter);
app.use('/payments', PaymentRouter);
app.use('/uploads', express.static('uploads'));
//CMS Routers
app.use('/cms/auth', CMSAuthRouter);
app.use('/cms/orders', CMSOrdersRouter);
app.use('/cms/items', CMSItemRouter);

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
    mongoose.set('strictQuery', false);
    await mongoose.connect(config.DB_URL);
    console.log('connected to database');
  } catch (e) {
    console.log('Error connecting to MongoDB');
    console.log(e);
    console.log('----------------------------');
  }
};

start();
