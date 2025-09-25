import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { followUser, unfollowUser } from '../../store/slices/usersSlice';
import Button from '../ui/Button';

const UserProfile = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useSelector(state => state.auth);

  const isOwnProfile = currentUser?.id === user.id;
  const isFollowing = currentUser?.following?.includes(user.id) || currentUser?.following?.includes(user._id);

  const handleFollowToggle = () => {
    if (isFollowing) {
      dispatch(unfollowUser(user.id || user._id));
    } else {
      dispatch(followUser(user.id || user._id));
    }
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-gray-600">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {user.name}
          </h1>

          <p className="text-gray-600 mb-4">{user.email}</p>

          {/* Stats */}
          <div className="flex justify-center md:justify-start gap-6 mb-4">
            <div className="text-center">
              <div className="font-bold text-lg text-gray-900">
                {user.recipesCount || 0}
              </div>
              <div className="text-sm text-gray-600">Recipes</div>
            </div>

            <div className="text-center">
              <div className="font-bold text-lg text-gray-900">
                {user.followersCount || user.followers?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Followers</div>
            </div>

            <div className="text-center">
              <div className="font-bold text-lg text-gray-900">
                {user.followingCount || user.following?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Following</div>
            </div>

            <div className="text-center">
              <div className="font-bold text-lg text-gray-900">
                {user.favoritesCount || 0}
              </div>
              <div className="text-sm text-gray-600">Favorites</div>
            </div>
          </div>

          {/* Action Buttons */}
          {isAuthenticated && !isOwnProfile && (
            <Button
              onClick={handleFollowToggle}
              variant={isFollowing ? 'outline' : 'default'}
              className="min-w-32"
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          )}

          {isOwnProfile && (
            <Button variant="outline" onClick={handleEditProfile}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Bio Section (if available) */}
      {user.bio && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold text-gray-900 mb-2">About</h3>
          <p className="text-gray-700 leading-relaxed">{user.bio}</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;