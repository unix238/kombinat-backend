const Router = require('express');
const authController = require('../../controllers/cms/auth-controller');
const authMiddleware = require('../../middleware/authMiddleware');
const sellerMiddleware = require('../../middleware/sellerMiddleware');

const AuthRouter = Router();

AuthRouter.post('/login', authController.login);
AuthRouter.post(
  '/addSeller',
  [authMiddleware, sellerMiddleware],
  authController.addSeller
);

AuthRouter.post(
  '/check',
  [authMiddleware, sellerMiddleware],
  authController.checkToken
);

module.exports = AuthRouter;
