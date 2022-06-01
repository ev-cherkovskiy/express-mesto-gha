const mongoose = require('mongoose');

// Описание схемы карточки
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Создание и экспорт модели карточки
module.exports = mongoose.model('card', cardSchema);