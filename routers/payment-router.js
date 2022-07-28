const Router = require('express');
const PaymentController = require('../controllers/payment-controller');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const PaymentRouter = Router();

PaymentRouter.post(
  '/new-order',
  [authMiddleware],
  PaymentController.addNewOrder
);

PaymentRouter.post(
  '/make-payment',
  [authMiddleware],
  PaymentController.makePayment
);

PaymentRouter.get(
  '/all-payments',
  [authMiddleware],
  [adminMiddleware],
  PaymentController.getAllPayments
);

module.exports = PaymentRouter;
