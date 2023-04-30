const jwt = require('jsonwebtoken');
const { UnauthError } = require('../errors/index-errors');

const JWT_SECRET = 'some-secret-key';

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new UnauthError('Необходима авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthError('Необходима авторизация');
  }

  req.user = payload;

  next();
};