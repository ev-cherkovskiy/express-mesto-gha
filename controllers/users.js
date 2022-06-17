const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Получение массива всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(err => res.send({ message: err.message }));
};

// Получение информации о пользователе
const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then(user => {
      // Если пользователя с таким айди нет, то идём дальше -- в блок обработки ошибок
      if (user === null) next();
      // Иначе возвращаем объект с информацией о пользователе
      res.send({ data: user });
    })
    .catch(err => res.send({ message: err.message }));
};

// Создание нового пользователя
const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then(hash => {
      User.create({ name, about, avatar, email, password: hash })
        .then(user => {
          const { name, about, avatar, email } = user;
          res.send({ data: { name, about, avatar, email } });
        })
        .catch(err => res.send({ message: err.message }));
    })
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
    .catch(err => res.send({ message: err.message }));
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
    .catch(err => res.send({ message: err.message }));
};


// Вход в систему
const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then(user => {
      console.log(user);
      // create jwt
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      console.log(token);
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true
        })
        .end();
      // res.send(token);

    })
    .catch(err => {
      res.status(401).send({ message: err.message });
    });
};

// Получение информации о текущем пользователе
const getUserInfo = (req, res) => {
  User.findById(req.user._id)
    .then(user => {
      res.send({ data: user });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// Экспорт всех контроллеров
module.exports = {
  getUsers,
  getUserById,
  createUser,
  editProfile,
  editAvatar,
  login,
  getUserInfo
};