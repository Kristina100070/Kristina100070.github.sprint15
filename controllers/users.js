const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const { JWT_SECRET } = require('../config/index');
const NotFoundError = require('../errors/not-found-err');
const BadRequstError = require('../errors/bad-request-err');
const Forbidden = require('../errors/forbidden-err');


const findUser = (req, res, next) => userModel.find({})
  .then((user) => {
    res.json(user);
  })
  .catch(next);

const findUserById = (req, res, next) => userModel.findOne({
  _id: req.params.userId,
})
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Нет пользователя с таким id');
    }
    res.json(user);
  })
  .catch(next);

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (password.length < 8) {
    throw new BadRequstError('Пароль слишком короткий');
  }
  bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      if (!user) {
        throw new BadRequstError('Пользователь с таким email уже существует');
      }
      res.send({
        _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  userModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (String(user._id) !== req.user._id) {
        throw new Forbidden('Нет доступа для обновления');
      }
      res.send({ data: user });
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  userModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (String(user._id) !== req.user._id) {
        throw new Forbidden('Нет доступа для обновления');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports = {
  findUser,
  findUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
