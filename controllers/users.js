const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NODE_ENV, JWT_SECRET } = require('../utils/config');
const NotFound = require('../errors/notFound');
const BadRequest = require('../errors/badRequest');
const ConnflictRequest = require('../errors/conflictRequst');

// Возвращение информации о пользователе
const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь с таким ID не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Данные введены некорректно'));
      } else {
        next(err);
      }
    });
};

// Проверка входа в приложение
const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) next(new BadRequest('Email или пароль не могут быть пустыми'));
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

// создание пользователя
const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConnflictRequest(`Пользователь '${email}' уже существует`));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Данные введены некорректно'));
      } else {
        next(err);
      }
    });
};

// Обновление информации о пользователе
const updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Данные введены некорректно'));
      } else if (err.code === 11000) {
        next(new ConnflictRequest(`Пользователь '${email}' уже существует`));
      } else {
        next(err);
      }
    });
};

module.exports = {
  login,
  createUser,
  updateUser,
  getUserInfo,
};
