const Movies = require('../models/movie');

// ERRORS
// 400
const BadRequestError = require('../errors/BadRequestError');

// 403
const ForbiddenError = require('../errors/ForbiddenError');

// 404
const NotFoundError = require('../errors/NotFoundError');

// получение списка фильмов
module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movies.find({ owner })
    .then((movies) => res.send(movies))
    .catch((err) => {
      next(err);
    });
};

// сохранение фильма
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  const owner = req.user._id;

  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

// удаление фильма
module.exports.deleteMovie = (req, res, next) => {
  Movies.findById(req.params.movieId)
    .orFail(new NotFoundError('Фильм не найден.'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Вы не можете удалить этот фильм.'));
      }
      return movie.remove().then(() => res.send({ message: 'Фильм удален.' }));
    })
    .catch(next);
};
