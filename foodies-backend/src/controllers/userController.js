const User = require('../models/User');
const Recipe = require('../models/Recipe');

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('recipesCount')
      .populate('favoritesCount')
      .select('-password');

    const userData = {
      ...user.toObject(),
      recipesCount: user.recipesCount || 0,
      favoritesCount: user.favoritesCount || 0,
      followersCount: user.followers.length,
      followingCount: user.following.length
    };

    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('recipesCount')
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const userData = {
      ...user.toObject(),
      recipesCount: user.recipesCount || 0,
      followersCount: user.followers ? user.followers.length : 0,
      followingCount: user.following ? user.following.length : 0
    };

    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user avatar
// @route   PUT /api/users/avatar
// @access  Private
const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload an image'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: req.file.path },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Follow user
// @route   PUT /api/users/:id/follow
// @access  Private
const followUser = async (req, res, next) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot follow yourself'
      });
    }

    // Check if already following
    if (currentUser.following.includes(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Already following this user'
      });
    }

    // Add to following/followers
    await User.findByIdAndUpdate(req.user.id, {
      $push: { following: req.params.id }
    });

    await User.findByIdAndUpdate(req.params.id, {
      $push: { followers: req.user.id }
    });

    res.status(200).json({
      success: true,
      message: 'User followed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unfollow user
// @route   PUT /api/users/:id/unfollow
// @access  Private
const unfollowUser = async (req, res, next) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if not following
    if (!currentUser.following.includes(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Not following this user'
      });
    }

    // Remove from following/followers
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { following: req.params.id }
    });

    await User.findByIdAndUpdate(req.params.id, {
      $pull: { followers: req.user.id }
    });

    res.status(200).json({
      success: true,
      message: 'User unfollowed successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMe,
  getUserById,
  updateAvatar,
  followUser,
  unfollowUser
};