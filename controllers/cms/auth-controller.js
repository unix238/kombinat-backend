const User = require('../../models/User');
const Seller = require('../../models/Seller');
const AuthService = require('../../services/cms/auth-service');

class AuthController {
  async login(req, res) {
    const { userLogin, password } = req.body;
    const response = await AuthService.CMSLogin(userLogin, password);

    if (response.status === 200) {
      return res.status(200).json(response);
    }
    if (response.status === 400) {
      return res.status(400).json(response);
    }
    if (response.status === 500) {
      return res.status(500).json(response);
    }
  }

  async addSeller(req, res) {
    try {
      const user = await User.findOne({ _id: req.user.id });
      const seller = await Seller.findOne({ owner: user._id });
      if (seller) {
        return res.status(400).json({ message: 'Seller already exists' });
      }
      const newSeller = new Seller({
        name: req.body.name,
        owner: user._id,
      });
      await newSeller.save();
      return res.status(200).json({ message: 'Seller added' });
    } catch (error) {
      console.log(
        `Error in addSeller method in auth-controller.js: ${error}\nfull error: ${error}`
      );
    }
  }

  async checkToken(req, res) {
    try {
      const user = await User.findOne({ _id: req.user.id });
      if (user) {
        return res.status(200).json({ message: 'Token is valid' });
      }
      return res.status(400).json({ message: 'Token is not valid' });
    } catch (error) {
      console.log(
        `Error in checkToken method in auth-controller.js: ${error}\nfull error: ${error}`
      );
    }
  }
}

module.exports = new AuthController();
