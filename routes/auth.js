const router = require('express').Router();

// валидация
const { celebrate, Joi } = require('celebrate');

// контроллеры
const { createUser, login } = require('../controllers/users');

// РОУТЫ
// создаёт пользователя
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(3).required(),
    }),
  }),
  createUser
);

// проверяет переданные в теле почту и пароль
router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(3).required(),
    }),
  }),
  login
);

module.exports = router;
