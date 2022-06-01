const Card = require('../models/card');
const { analyseError } = require('../utils/utils');

const getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(err => analyseError(res, err));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send({ data: card }))
    .catch(err => analyseError(res, err));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => res.send({ data: card }))
    .catch(err => analyseError(res, err));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id }
    },
    {
      new: true,
      runValidators: true,
      upsert: false
    }
  )
    .then(card => res.send({ data: card }))
    .catch(err => analyseError(res, err));
};

const unlikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id }
    },
    {
      new: true,
      runValidators: true,
      upsert: false
    }
  )
    .then(card => res.send({ data: card }))
    .catch(err => analyseError(res, err));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard
};