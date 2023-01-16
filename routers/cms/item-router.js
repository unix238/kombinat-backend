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
ItemRouter.get(
  '/brands',
  [authMiddleware, sellerMiddleware],
  ItemController.getAllBrands
);

ItemRouter.get(
  '/categories',
  [authMiddleware, sellerMiddleware],
  ItemController.getAllCategories
);

ItemRouter.get(
  '/tags',
  [authMiddleware, sellerMiddleware],
  ItemController.getAllTags
);
module.exports = ItemRouter;
