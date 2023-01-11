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
}

module.exports = new AuthController();
