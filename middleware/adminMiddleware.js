const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const current = await User.findById(req.user.id);
    if (!current) {
      throw new Error('No user');
    }
    if (current.role !== 'ADMIN') {
      throw new Error('No user');
    }
    next();
  } catch (e) {
    req.error = e;
    res.status(400).json({ error: 'authorization error no admin' });
  }
};

module.exports = adminMiddleware;
