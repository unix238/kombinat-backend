const User = require('../models/User');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const { SECRET } = require('../config');

const generateAccessToken = (id, role) => {
  const payload = {
    id,
    role,
  };
  return jsonwebtoken.sign(payload, SECRET, { expiresIn: '24h' });
};

class authService {
  async activate(req, res) {
    try {
      const { activationCode } = req.params;
      const user = await User.findOne({ activationCode });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      user.isActivated = true;
      await user.save();
      return res.status(200).json({ message: 'User activated' });
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: 'activate error' });
    }
  }

  async reg(req, res) {
    try {
      const { name, username, password, email, phone } = req.body;
      const userCondidate = await User.findOne({ username });
      if (userCondidate) {
        if (userCondidate.isActivated) {
          res.status(400).json({ message: 'Username already exists' });
          return;
        }
        res.status(403).json({ message: 'activate your account' });
        return;
      }
      const emailCondidate = await User.findOne({ email });
      if (emailCondidate) {
        if (emailCondidate.isActivated) {
          res.status(400).json({ message: 'Username already exists' });
          return;
        }
        res.status(403).json({ message: 'activate your account' });
        return;
      }
      const phoneCondidate = await User.findOne({ phone });
      if (phoneCondidate) {
        if (phoneCondidate.isActivated) {
          res.status(400).json({ message: 'Username already exists' });
          return;
        }
        res.status(403).json({ message: 'activate your account' });
        return;
      }

      const hashPassword = await bcrypt.hash(password, 7);
      const user = new User({
        name,
        phone,
        email,
        password: hashPassword,
        username,
        role: 'USER',
      });
      await user.save();
      return res.json({ message: 'User created' });
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: 'registration error' });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Invalid password' });
      }
      const token = generateAccessToken(user._id, user.role);

      res.status(200).json({ token, user });
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: 'Login error' });
    }
  }

  async checkToken(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jsonwebtoken.verify(token, SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      res.json(user);
      next();
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: 'check token error' });
    }
  }

  async getUser(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jsonwebtoken.verify(token, SECRET);
      const user = await User.findById(decoded.id);
      res.json(user);
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: 'get user error' });
    }
  }

  async getUserByID(req, res, next) {
    try {
      const user = await User.findById(req.params.id);
      res.json(user);
    } catch (e) {
      console.log(e);
      next();
    }
  }
}

module.exports = new authService();
