const mongoose = require('mongoose');
const isEmail = require('validator').isEmail;
const bcrypt = require('bcryptjs');

// Описание схемы пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
    default: 'Жак-Ив Кусто'
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
    default: 'Исследователь'
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        let regExp = /^https?\:\/\/(w{3})?[-._~:/?#[]@!$&'()*+,;=]+/;
        return regExp.test(v);
      },
      message: 'Необходимо ввести корректный url'
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return isEmail(v);
      },
      message: 'Необходимо ввести корректный email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  }
});


userSchema.statics.findUserByCredentials = function(email, password) {
  return this.findOne({ email }).select('+password')
  .then(user => {
    if (!user) {
      return Promise.reject(new Error('Неправильные почта или пароль'));
    }
    return bcrypt.compare(password, user.password)
    .then(matched => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return user;
    });
  });
};

// Создание и экспорт схемы пользователя
module.exports = mongoose.model('user', userSchema);