const User = require('../../models/User');
const { SECRET } = require('../../config');
const EmailSender = require('../../utils/sendEmail');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const generateAccessToken = (id, role, user) => {
  const payload = {
    id,
    role,
    user,
  };
  return jsonwebtoken.sign(payload, SECRET, { expiresIn: '24h' });
};

class AuthService {
  async CMSLogin(userLogin, password) {
    try {
      const user = await User.findOne({ email: userLogin });
      if (!user) {
        return { status: 400, message: 'User not found' };
      }

      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return { status: 400, message: 'Invalid password' };
      }

      if (user.role !== 'SHOP_OWNER') {
        console.log({ role: user.role });
        return { status: 400, message: 'Invalid role' };
      }

      const token = generateAccessToken(user._id, user.role, user);
      return { status: 200, token };
    } catch (e) {
      return res.status(400).json({ error: 'CMS Login error' });
    }
  }
}

module.exports = new AuthService();
