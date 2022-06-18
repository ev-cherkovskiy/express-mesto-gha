// Импорт модели карточки
const Card = require('../models/card');
const {
  ServerError,
  NotFoundError,
  ForbiddenError,
} = require('../utils/errors');

// Получение массива карточек
const getCards = (req, res, next) => {
  Card.find({})
    .orFail(() => {
      throw new ServerError('Невозможно загрузить карточки');
    })
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      next(err);
    });
};

// Создание новой карточки
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};

// Удаление карточки
const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточки с таким id не найдено');
    })
    .then((card) => {
      if (req.user._id !== card.owner) {
        throw new ForbiddenError('Невозможно удалить карточку, созданную другим пользователем');
      }
      card.remove()
        .then(() => {
          res.send({ message: 'Карточка удалена' });
        });
    })
    .catch((err) => {
      next(err);
    });
};

// Проставление лайка карточке
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    {
      new: true,
    },
  )
    .orFail(() => {
      throw new NotFoundError('Карточки с таким id не найдено');
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};

// Удаление лайка карточки
const unlikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    },
  )
    .orFail(() => {
      throw new NotFoundError('Карточки с таким id не найдено');
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};

// Экспорт всех контроллеров
module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
};
