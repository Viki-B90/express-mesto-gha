const Cards = require('../models/card');
const statusCode = require('../utils/statusCode')

const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require('../errors/index-errors');

module.exports.getAllCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Cards.create({ name, link, owner })
    .then((card) => res.status(statusCode.CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Cards.findById(cardId)
    .orFail(() => new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => {
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user.payload)) {
        return next(new ForbiddenError('Нельзя удалять чужие карточки'));
      }
      return card.remove()
        .then(() => res.send({ card, message: 'Карточка удалена' }));
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      return res.send({ card, message: 'Лайк успешно поставлен' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      return res.send({ card, message: 'Лайк успешно удален' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
      } else {
        next(err);
      }
    });
};