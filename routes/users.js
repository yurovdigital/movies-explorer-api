const router = require('express').Router();

// валидация
const { celebrate, Joi } = require('celebrate');

// контроллеры
const { getUsers, updateUser } = require('../controllers/users');

// РОУТЫ
// возвращает информацию о пользователе (email и имя)
router.get('/users/me', getUsers);

// обновляет информацию о пользователе (email и имя)
router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
    }),
  }),
  updateUser
);

module.exports = router;
