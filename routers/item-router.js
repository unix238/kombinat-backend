const Router = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const ItemController = require('../controllers/item-controller');

const ItemRouter = Router();

ItemRouter.get('/get', ItemController.getItems);
ItemRouter.get('/get/:id', ItemController.getByID);

ItemRouter.post(
  '/add',
  [authMiddleware, adminMiddleware],
  ItemController.addItem
);

module.exports = ItemRouter;
