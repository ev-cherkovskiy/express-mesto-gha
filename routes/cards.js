const router = require('express').Router();

// Импорт контроллеров
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard
} = require('../controllers/cards')

// Описание роутинга
router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', unlikeCard);

// Экспорт роутинга
module.exports = router;