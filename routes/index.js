const router = require('express').Router();
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFound = require('../errors/notFound');
const { checkLogin, checkCreateUser } = require('../middlewares/celebrates');

router.post('/signin', checkLogin, login);
router.post('/signup', checkCreateUser, createUser);

router.use(auth);
router.use('/users', userRoutes);
router.use('/movies', movieRoutes);

router.use('*', (req, res, next) => {
  next(new NotFound('Неправильно введен адрес'));
});

module.exports = router;
