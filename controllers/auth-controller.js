const authService = require('../services/auth-service');

class AuthController {
  async register(req, res) {
    await authService.reg(req, res);
  }
  async login(req, res) {
    return await authService.login(req, res);
  }
  async getUser(req, res, next) {
    try {
      await authService.getUser(req, res, next);
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: 'get user error' });
    }
  }
  async getUserByID(req, res) {
    try {
      await authService.getUserByID(req, res);
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: 'get user error' });
    }
  }
  async checkToken(req, res, next) {
    try {
      await authService.checkToken(req, res, next);
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: 'check token error' });
    }
  }
}

module.exports = new AuthController();
