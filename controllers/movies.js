const Movie = require('../models/movies');
const NotFound = require('../errors/notFound');
const Forbidden = require('../errors/forbidden');
const BadRequest = require('../errors/badRequest');

const getMovies = (req, res) => {
  Movie.find({})
    .then((movie) => { res.send(movie); })
    .catch(() => {});
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => { res.send(movie); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(err.message));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) { throw new NotFound('Карточка не найдена.'); }
      if (movie.owner.toString() !== owner) { throw new Forbidden('Нет прав на удаление карточки'); }
      return Movie.deleteOne(movie);
    })
    .then((card) => { res.send(card); })
    .catch((err) => {
      if (err.message === 'InvalidCardId') {
        next(new NotFound('Карточка не найдена'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Данные введены некорректно'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
};
