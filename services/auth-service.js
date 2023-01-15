const User = require('../models/User');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const { SECRET } = require('../config');
const EmailSender = require('../utils/sendEmail');

const MailMessage = (code) => {
  return (
    "<html><head></head><body><h1 style='color: red'>" +
    code +
    '</h1></body></html>'
  );
};

const generateAccessToken = (id, role, user) => {
  const payload = {
    id,
    role,
    user,
  };
  return jsonwebtoken.sign(payload, SECRET, { expiresIn: '24h' });
};

class authService {
  async sendCode(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      const code = user.activationCode;
      EmailSender.sendEmail(email, 'Activation Code', code);
      return res.status(200).json({ message: 'Code sent' });
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: 'send code error' });
    }
  }

  async register(req, res) {
    try {
      const data = req.body;
      const emailCondidate = await User.findOne({ email: data.email });
      const phoneCondidate = await User.findOne({ phone: data.phone });
      if (emailCondidate || phoneCondidate) {
        if (emailCondidate.isActivated) {
          return res.status(400).json({ message: 'Account already exists' });
        } else {
          return res.status(205).json({ message: 'Activate your account' });
        }
      }
      const user = new User({
        name: data.name,
        phone: data.phone,
        email: data.email,
        role: 'USER',
      });
      await user.save();
      return res.status(200).json({ message: user });
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: 'register error' });
    }
  }

  async checkActivationCode(req, res) {
    try {
      const { activationCode, email } = req.body;
      const user = await User.findOne({ email });
      console.log(user);
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      if (user.activationCode == activationCode) {
        user.isActivated = true;
        await user.save();
        return res.status(200).json({ message: 'Code is correct' });
      }
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: 'check activation code error' });
    }
  }

  async continueRegister(req, res) {
    try {
      const { password, email } = req.body;
      const user = await User.findOne({ email });
      if (user) {
        if (!user.isActivated) {
          return res.status(403).json({ message: 'Account is not activated' });
        }
      }
      const hashPassword = await bcrypt.hash(password, 7);
      user.password = hashPassword;
      await user.save();
      return res
        .status(200)
        .json({ message: 'User password saved', hash: hashPassword });
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: 'adding password error' });
    }
  }

  async login(req, res) {
    try {
      const { userLogin, password } = req.body;
      const user =
        (await User.findOne({ email: userLogin })) ||
        (await User.findOne({ phone: userLogin }));
      console.log(user);
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Invalid password' });
      }
      const token = generateAccessToken(user._id, user.role, user);

      res.status(200).json({ token, user: user._id });
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
