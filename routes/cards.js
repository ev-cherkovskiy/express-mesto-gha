const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

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

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required()
    })
  }),
  createCard
);

router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24)
    })
  }),
  deleteCard
);

router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24)
    })
  }),
  likeCard
);

router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24)
    })
  }),
  unlikeCard
);

// Экспорт роутинга
module.exports = router;