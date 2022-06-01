const mongoose = require('mongoose');

// Описание схемы пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  },
  avatar: {
    type: String,
    required: true
  }
});

// Создание и экспорт схемы пользователя
module.exports = mongoose.model('user', userSchema);