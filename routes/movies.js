const router = require('express').Router();

// валидация
const { celebrate, Joi } = require('celebrate');

// контроллеры
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

// РОУТЫ
// возвращает все сохранённые текущим  пользователем фильмы
router.get('/movies', getMovies);

// создаёт фильм с переданными в теле
router.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string()
        .required()
        .pattern(
          // eslint-disable-next-line comma-dangle
          /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/
        ),
      trailer: Joi.string()
        .required()
        .pattern(
          // eslint-disable-next-line comma-dangle
          /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/
        ),
      thumbnail: Joi.string()
        .required()
        .pattern(
          // eslint-disable-next-line comma-dangle
          /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/
        ),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  // eslint-disable-next-line comma-dangle
  createMovie
);

// удаляет сохранённый фильм по id
router.delete(
  '/movies/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex(),
    }),
  }),
  // eslint-disable-next-line comma-dangle
  deleteMovie
);

module.exports = router;
