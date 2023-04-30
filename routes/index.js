const express = require('express');

const auth = require('../middlewares/auth');
const routesUsers = require('./users');
const routesCards = require('./cards');
const { validateSignUp, validateSignIn } = require('../middlewares/validators');
const { createUser, login } = require('../controllers/users');

const { NotFoundError } = require('../errors/index-errors');

const router = express.Router();

router.post('/signup', validateSignUp, createUser);
router.post('/signin', validateSignIn, login);

router.use('/users', auth, routesUsers);
router.use('/cards', auth, routesCards);

router.use('*', auth, () => {
  throw new NotFoundError('Запрашиваемый URL не найден');
});

module.exports = router;