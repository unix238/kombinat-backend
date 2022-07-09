const Router = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const ItemController = require('../controllers/item-controller');

const ItemRouter = Router();

ItemRouter.get('/get', ItemController.getItems);
ItemRouter.get('/get/:id', ItemController.getByID);
ItemRouter.get('/tags', ItemController.getAllTags);
ItemRouter.get('/tag/:id', ItemController.getTagByID);
ItemRouter.get('/by-tag/:tag', ItemController.getItemsByTag);
ItemRouter.get('/categories', ItemController.getAllCategories);

ItemRouter.post(
  '/categories/add',
  [authMiddleware, adminMiddleware],
  ItemController.addCategory
);
ItemRouter.post(
  '/add',
  [authMiddleware, adminMiddleware],
  ItemController.addItem
);

ItemRouter.post(
  '/tag/add',
  [authMiddleware, adminMiddleware],
  ItemController.addTag
);

module.exports = ItemRouter;
