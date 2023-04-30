const router = require('express').Router();

const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  validateCardCreate,
  validateCardId,
} = require('../middlewares/validators');

router.get('/', getAllCards);
router.post('/', validateCardCreate, createCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = router;