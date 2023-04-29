const jwt = require('jsonwebtoken');
const { UnauthError } = require('../errors/index-errors');

const JWT_SECRET = 'some-secret-key';

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthError('Необходима авторизация');
    }

    const token = authorization.replace('Bearer ', '');
    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      throw new UnauthError('Необходима авторизация');
    }

    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
}