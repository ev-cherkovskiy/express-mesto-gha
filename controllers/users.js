/* eslint-disable no-shadow */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ServerError,
  NotFoundError,
  ConflictError,
  BadRequestError,
} = require('../utils/errors');

// Получение массива всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .orFail(() => {
      throw new ServerError('Невозможно загрузить массив пользователей');
    })
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      next(err);
    });
};

// Получение информации о пользователе
const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователя с таким id не найдено');
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

// Создание нового пользователя
const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          const {
            name,
            about,
            avatar,
            email,
          } = user;
          res.send({
            data: {
              name,
              about,
              avatar,
              email,
            },
          });
        })
        .catch((err) => {
          next(err);
        });
    });
};

// Редактирование имени и описания пользователя
const editProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      next(err);
    });
};

// Редактирование аватара пользователя
const editAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      next(err);
    });
};

// Вход в систему
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .orFail(() => {
      throw new BadRequestError('Указана неправильная почта или пароль');
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      next();
      // .status(200).send({ data: { message: 'Вход выполнен'}})
      // res.send({ message: 'Вход выполнен' });
    })
    .then(() => {
      res.send({ message: 'Вход выполнен' });
    })
    .catch((err) => {
      next(err);
    });
};

// Получение информации о текущем пользователе
const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователя с таким id не найдено');
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      next(err);
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
  getUserInfo,
};
