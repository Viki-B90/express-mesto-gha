require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { errors } = require('celebrate');
const handleError = require('./middlewares/handleError');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const allRouters = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(limiter);
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use(allRouters);

app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`Приложение слушает порт ${PORT}`)
});