const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// ENV
const { NODE_ENV, JWT_SECRET } = process.env;

// ERRORS
// 400
const BadRequestError = require('../errors/BadRequestError');

// 404
const NotFoundError = require('../errors/NotFoundError');

// 409
const ConflictError = require('../errors/ConflictError');

// получение списка пользователей
module.exports.getUsers = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch((err) => {
      next(err);
    });
};

// Обновление пользователя
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      email,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError('Пользователь не найден.'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким Email уже существует'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

// создание пользователя
module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      /* eslint-disable implicit-arrow-linebreak */
      User.create({
        name,
        email,
        password: hash,
      })
    )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else if (err.code === 11000) {
        next(
          new ConflictError('Пользователь с такими данными уже есть в базе')
        );
      } else {
        next(err);
      }
    });
};

// логин
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.status(200).send({ token });
    })
    .catch(next);
};
