const User = require('../models/user');
const { analyseError } = require('../utils/utils');

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(err => analyseError(res, err));
};

const getUserById = (req, res) => {
  User.findById(req.params._id)
    .then(user => res.send({ data: user }))
    .catch(err => analyseError(res, err));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => analyseError(res, err));
};

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

module.exports = {
  getUsers,
  getUserById,
  createUser,
  editProfile,
  editAvatar
};