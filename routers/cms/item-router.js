const Router = require('express');
const ItemController = require('../../controllers/cms/item-controller');
const authMiddleware = require('../../middleware/authMiddleware');
const sellerMiddleware = require('../../middleware/sellerMiddleware');

const ItemRouter = Router();

ItemRouter.get(
  '/all',
  [authMiddleware, sellerMiddleware],
  ItemController.getAllItems
);

module.exports = ItemRouter;
