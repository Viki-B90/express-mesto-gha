const express = require('express');
const mongoose = require('mongoose');
const routesUsers = require('./routes/users');
const routesCards = require('./routes/cards');
const codeError = require('./utils/error');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '643ed5ac85513caf03d61cc9',
  };

  next();
});

app.use(routesUsers);
app.use(routesCards);

app.use((req, res) => {
  res.status(codeError.NOT_FOUND).send({ message: 'Запрашиваемый URL не найден' });
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  //useCreateIndex: true,
  //useFindAndModify: false,
});

app.listen(PORT, () => {
  console.log(`Приложение слушает порт ${PORT}`)
});