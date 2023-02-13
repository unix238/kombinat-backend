const Router = require('express');
const ItemController = require('../../controllers/cms/item-controller');
const authMiddleware = require('../../middleware/authMiddleware');
const sellerMiddleware = require('../../middleware/sellerMiddleware');
const multer = require('multer');
const path = require('path');
const uploadMiddleware = require('../../middleware/uploadMiddleware');

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

ItemRouter.post(
  '/addItem',
  [authMiddleware, uploadMiddleware.array('image')],
  ItemController.addItem
);

ItemRouter.post(
  '/updateItem',
  [authMiddleware, sellerMiddleware],
  ItemController.updateItem
);

ItemRouter.delete(
  '/delete/:id',
  [authMiddleware, sellerMiddleware],
  ItemController.deleteItem
);
module.exports = ItemRouter;
