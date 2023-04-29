const router = require('express').Router();

const {
  getAllUsers,
  getCurrentUser,
  getUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

const {
  validateUserId,
  validateUpdateProfile,
  validateUpdateAvatar,
} = require('../middlewares/validators');

router.get('/', getAllUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateUserId, getUser);
router.patch('/me', validateUpdateProfile, updateProfile);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;