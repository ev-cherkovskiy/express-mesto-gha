const router = require('express').Router();

// Импорт контроллеров
const {
  getUsers,
  getUserById,
  // createUser,
  editProfile,
  editAvatar,
  getUserInfo
} = require('../controllers/users')

// Описание роутинга
router.get('/', getUsers);
router.get('/:userId', getUserById);
// router.post('/', createUser);
router.patch('/me', editProfile);
router.patch('/me/avatar', editAvatar);
router.get('/me', getUserInfo);

// Экспорт роутинга
module.exports = router;