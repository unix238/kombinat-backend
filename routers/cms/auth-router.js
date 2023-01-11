const Router = require('express');
const authController = require('../../controllers/cms/auth-controller');
const authMiddleware = require('../../middleware/authMiddleware');
const adminMiddleware = require('../../middleware/adminMiddleware');

const AuthRouter = Router();

AuthRouter.post('/login', authController.login);

module.exports = AuthRouter;
