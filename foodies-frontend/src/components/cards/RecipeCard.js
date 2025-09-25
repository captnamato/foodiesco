import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../../store/slices/recipesSlice';
import { cn } from '../../utils/cn';

const RecipeCard = ({ recipe, className }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);

  const isFavorited = recipe.favoritedBy?.includes(user?.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      dispatch(toggleFavorite(recipe._id));
    }
  };

  return (
    <div className={cn(
      'bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden',
      className
    )}>
      <Link to={`/recipe/${recipe._id}`} className="block visited:text-inherit hover:text-inherit focus:text-inherit">
        {/* Recipe Image */}
        <div className="relative h-48 bg-gray-200">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-recipe.jpg';
            }}
          />

          {/* Favorite Button */}
          {isAuthenticated && (
            <button
              onClick={handleFavoriteClick}
              className={cn(
                'absolute top-3 right-3 p-2 rounded-full shadow-sm transition-colors',
                isFavorited
                  ? 'bg-foodies-orange text-white'
                  : 'bg-white text-gray-600 hover:text-foodies-orange'
              )}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}

          {/* Cooking Time Badge */}
          <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
            {recipe.cookingTime} min
          </div>
        </div>

        {/* Recipe Info */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
              {recipe.title}
            </h3>
            {recipe.popularity && (
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                {recipe.popularity}
              </div>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {recipe.description}
          </p>

          <div className="flex items-center justify-between">
            {/* Author */}
            <div className="flex items-center">
              {recipe.author?.avatar ? (
                <img
                  src={recipe.author.avatar}
                  alt={recipe.author.name}
                  className="w-6 h-6 rounded-full object-cover mr-2"
                />
              ) : (
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                  <span className="text-xs text-gray-600">
                    {recipe.author?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-sm text-gray-700">{recipe.author?.name}</span>
            </div>

            {/* Category */}
            {recipe.category && (
              <span className="px-2 py-1 bg-foodies-orange bg-opacity-10 text-foodies-orange text-xs rounded-full">
                {recipe.category.name}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RecipeCard;