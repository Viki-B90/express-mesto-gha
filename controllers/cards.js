const Cards = require('../models/card');
const statusCode = require('../utils/statusCode');

module.exports.getAllCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(statusCode.SERVER_ERROR).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Cards.create({ name, link, owner })
    .then((card) => res.status(statusCode.CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(statusCode.BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(statusCode.SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Cards.findByIdAndRemove(cardId)
    .orFail(() => new Error('NotFound'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(statusCode.BAD_REQUEST).send({ message: 'Переданы некорректные данные для удаления карточки' });
      } else if (err.message === 'NotFound') {
        res.status(statusCode.NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.status(statusCode.SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error('NotFound'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(statusCode.BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else if (err.message === 'NotFound') {
        res.status(statusCode.NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(statusCode.SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error('NotFound'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(statusCode.BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка' });
      } else if (err.message === 'NotFound') {
        res.status(statusCode.NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(statusCode.SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};