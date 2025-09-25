const express = require('express');
const {
  getMe,
  getUserById,
  updateAvatar,
  followUser,
  unfollowUser
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/me', getMe);
router.get('/:id', getUserById);
router.put('/avatar', upload.single('avatar'), updateAvatar);
router.put('/:id/follow', followUser);
router.put('/:id/unfollow', unfollowUser);

module.exports = router;