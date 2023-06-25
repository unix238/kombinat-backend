// const authService = require("../services/auth-service");
import authService from "../services/auth-service.js";

class AuthController {
  async register(req, res) {
    await authService.register(req, res);
  }
  async continueRegistration(req, res) {
    await authService.continueRegister(req, res);
  }
  async checkActivationCode(req, res) {
    try {
      await authService.checkActivationCode(req, res);
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: "check activation code error" });
    }
  }

  async login(req, res) {
    return await authService.login(req, res);
  }
  async getUser(req, res, next) {
    try {
      await authService.getUser(req, res, next);
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: "get user error" });
    }
  }
  async getUserByID(req, res) {
    try {
      await authService.getUserByID(req, res);
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: "get user error" });
    }
  }
  async checkToken(req, res, next) {
    try {
      await authService.checkToken(req, res, next);
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: "check token error" });
    }
  }
  async sendCode(req, res) {
    try {
      await authService.sendCode(req, res);
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: "send code error" });
    }
  }

  async googleAuth(req, res) {
    try {
      console.log(req.body);
      const result = await authService.googleAuth(req.body);
      if (result.status == 200) {
        return res.status(200).json(result);
      }
      return res.status(result.status).json({ message: result.error });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ e });
    }
  }

  async updateUser(req, res) {
    try {
      const response = await authService.updateUser(req.body);
      return res.status(response.status).json(response);
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: "update user error" });
    }
  }

  async updateDeliveryData(req, res) {
    try {
      const response = await authService.updateDelivery(req.body);
      return res.status(response.status).json(response);
    } catch (e) {
      console.log(e);
      res
        .status(400)
        .json({ error: "update delivery data error", e, em: e.message });
    }
  }
}

// module.exports = new AuthController();
export default new AuthController();
