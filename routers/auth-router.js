const Router = require('express');
const authController = require('../controllers/auth-controller');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const AuthRouter = Router();

AuthRouter.post('/register', authController.register);
AuthRouter.post('/send-code', authController.sendCode);
AuthRouter.post('/continue-registration', authController.continueRegistration);
AuthRouter.post('/check-activation-code', authController.checkActivationCode);
AuthRouter.post('/login', authController.login);
AuthRouter.post('/token-verify', [authMiddleware], authController.checkToken);
AuthRouter.get('/user', [authMiddleware], authController.getUser);
AuthRouter.get(
  '/admin/:id',
  [authMiddleware, adminMiddleware],
  authController.getUserByID
);

module.exports = AuthRouter;
