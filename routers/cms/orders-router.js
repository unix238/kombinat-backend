const Router = require('express');
const ordersController = require('../../controllers/cms/orders-controller');
const authMiddleware = require('../../middleware/authMiddleware');
const sellerMiddleware = require('../../middleware/sellerMiddleware');

const OrdersRouter = Router();

OrdersRouter.get(
  '/uniqueClients',
  [authMiddleware, sellerMiddleware],
  ordersController.uniqueClients
);

OrdersRouter.get(
  '/getAllItems',
  [authMiddleware, sellerMiddleware],
  ordersController.getAllItems
);

module.exports = OrdersRouter;
