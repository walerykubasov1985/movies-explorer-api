const router = require('express').Router();

const {
  getUserInfo,
  updateUser,
} = require('../controllers/users');

const { checkUpdateUser } = require('../middlewares/celebrates');

router.get('/me', getUserInfo);
router.patch('/me', checkUpdateUser, updateUser);

module.exports = router;
