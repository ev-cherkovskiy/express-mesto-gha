// Импорт модели карточки и функции обработки ошибок
const Card = require('../models/card');
const { analyseError } = require('../utils/utils');

// Получение массива карточек
const getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(err => res.send({ message: err.message }));
};

// Создание новой карточки
const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send({ data: card }))
    .catch(err => res.send({ message: err.message }));
};

// Удаление карточки
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => {
      // Если карточки с таким айди нет, то идём дальше -- в блок обработки ошибок
      if (card === null) next();
      // Иначе возвращаем объект с информацией об удалённой карточке в случае,
      // если эта карточка была создана пользователем
      if (req.user._id === card.owner) res.send({ data: card });
    })
    .catch(err => res.send({ message: err.message }));
};

// Проставление лайка карточке
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id }
    },
    {
      new: true,
    }
  )
    .then(card => {
      // Если карточки с таким айди нет, то идём дальше -- в блок обработки ошибок
      if (card === null) next();
      // Иначе возвращаем объект с информацией о карточке
      res.send({ data: card });
    })
    .catch(err => res.send({ message: err.message }));
};

// Удаление лайка карточки
const unlikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id }
    },
    {
      new: true,
    }
  )
    .then(card => {
      // Если карточки с таким айди нет, то идём дальше -- в блок обработки ошибок
      if (card === null) next();
      // Иначе возвращаем объект с информацией о карточке
      res.send({ data: card });
    })
    .catch(err => res.send({ message: err.message }));
};

// Экспорт всех контроллеров
module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard
};