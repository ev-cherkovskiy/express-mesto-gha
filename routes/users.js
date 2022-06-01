const router = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  editProfile,
  editAvatar
} = require('../controllers/users')

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', editProfile);
router.patch('/me/avatar', editAvatar);

module.exports = router;