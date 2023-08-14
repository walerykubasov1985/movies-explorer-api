const router = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const { checkMovieId, checkCreateMovie } = require('../middlewares/celebrates');

router.get('/', getMovies);
router.post('/', checkCreateMovie, createMovie);
router.delete('/:movieId', checkMovieId, deleteMovie);

module.exports = router;
