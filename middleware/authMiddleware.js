const jsonwebtoken = require('jsonwebtoken');
const { SECRET } = require('../config');

const authMiddleware = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      res.json({ message: 'No token, authorization denied' });
    }
    const decodedData = jsonwebtoken.verify(token, SECRET);
    req.user = decodedData;
    next();
  } catch (e) {
    req.error = e;
    res.status(400).json({ error: 'Error in authMiddleware' });
  }
};

module.exports = authMiddleware;
