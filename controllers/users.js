// Импорт модели пользователя и функции обработки ошибок
const User = require('../models/user');
const { analyseError } = require('../utils/utils');

// Получение массива всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(err => analyseError(res, err));
};

// Получение информации о пользователе
const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      // Если пользователя с таким айди нет, то идём дальше -- в блок обработки ошибок
      if (user === null) next();
      // Иначе возвращаем объект с информацией о пользователе
      res.send({ data: user });
    })
    .catch(err => analyseError(res, err));
};

// Создание нового пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => analyseError(res, err));
};

// Редактирование имени и описания пользователя
const editProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about
    },
    {
      new: true,
      runValidators: true,
      upsert: true
    }
  )
    .then(user => res.send({ data: user }))
    .catch(err => analyseError(res, err));
};

// Редактирование аватара пользователя
const editAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar
    },
    {
      new: true,
      runValidators: true,
      upsert: true
    }
  )
    .then(user => res.send({ data: user }))
    .catch(err => analyseError(res, err));
};

// Экспорт всех контроллеров
module.exports = {
  getUsers,
  getUserById,
  createUser,
  editProfile,
  editAvatar
};