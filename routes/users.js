const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

// Импорт контроллеров
const {
  getUsers,
  getUserById,
  editProfile,
  editAvatar,
  getUserInfo
} = require('../controllers/users')

// Описание роутинга

router.get('/', getUsers);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24)
    })
  }),
  getUserById
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    })
  }),
  editProfile
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required(),
    })
  }),
  editAvatar
);

router.get('/me', getUserInfo);

// Экспорт роутинга
module.exports = router;