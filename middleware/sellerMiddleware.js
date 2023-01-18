const User = require('../models/User');
const Seller = require('../models/Seller');

const sellerMiddleware = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const current = await User.findById(req.user.id);
    if (!current) {
      throw new Error('No user');
    }
    if (current.role !== 'SHOP_OWNER') {
      throw new Error('No user');
    }
    const seller = await Seller.findOne({ owner: current._id });
    if (!seller) {
      throw new Error('No seller');
    }
    req.seller = seller;

    next();
  } catch (e) {
    req.error = e;
    res.status(400).json({ error: 'Error, Role must be different' });
  }
};

module.exports = sellerMiddleware;
