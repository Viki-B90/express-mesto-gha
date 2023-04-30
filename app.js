require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { errors } = require('celebrate');
const { validateSignUp, validateSignIn } = require('./middlewares/validators');

const handleError = require('./middlewares/handleError');
const { NotFoundError } = require('./errors/index-errors');

const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');

const routesUsers = require('./routes/users');
const routesCards = require('./routes/cards');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signup', validateSignUp, createUser);
app.post('/signin', validateSignIn, login);

app.use(auth);

app.use('/users', auth, routesUsers);
app.use('/cards', auth, routesCards);

app.use(helmet());
app.use(limiter);
app.use(cookieParser());

app.use(errors());
app.use(handleError);

app.use('*', auth, () => {
  throw new NotFoundError('Запрашиваемый URL не найден');
});

app.listen(PORT, () => {
  console.log(`Приложение слушает порт ${PORT}`)
});