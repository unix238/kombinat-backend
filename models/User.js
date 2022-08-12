const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const generateActivationLink = () => {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = chars.length;
  let activationLink = '';
  for (let i = 0; i < 120; i++) {
    activationLink += chars[Math.floor(Math.random() * length)];
  }
  return activationLink;
};

const generateActivationCode = () => {
  const chars = '0123456789';
  const length = chars.length;
  let activationCode = '';
  for (let i = 0; i < 4; i++) {
    activationCode += chars[Math.floor(Math.random() * length)];
  }
  return activationCode;
};

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  role: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isActivated: { type: Boolean, default: false },
  activationCode: { type: String, default: generateActivationCode() },
});

module.exports = mongoose.model('User', userSchema);
