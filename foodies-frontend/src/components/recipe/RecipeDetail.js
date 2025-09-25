import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../../store/slices/recipesSlice';
import Button from '../ui/Button';

const RecipeDetail = ({ recipe }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);

  const isFavorited = recipe.favoritedBy?.includes(user?.id);
  const isOwner = user?.id === recipe.author?._id;

  const handleFavoriteClick = () => {
    if (isAuthenticated) {
      dispatch(toggleFavorite(recipe._id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          {/* Recipe Image */}
          <div className="md:w-1/2">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-80 object-cover rounded-lg shadow-lg"
              onError={(e) => {
                e.target.src = '/placeholder-recipe.jpg';
              }}
            />
          </div>

          {/* Recipe Info */}
          <div className="md:w-1/2 space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-3 py-1 bg-foodies-orange bg-opacity-10 text-foodies-orange rounded-full">
                {recipe.category?.name}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                {recipe.area?.name}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              {recipe.title}
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed">
              {recipe.description}
            </p>

            {/* Recipe Meta */}
            <div className="flex items-center gap-6 py-4 border-t border-gray-200">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">
                  <strong>{recipe.cookingTime}</strong> minutes
                </span>
              </div>

              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">
                  <strong>{recipe.favoritedBy?.length || 0}</strong> favorites
                </span>
              </div>
            </div>

            {/* Author */}
            <div className="flex items-center justify-between py-4 border-t border-gray-200">
              <Link
                to={`/user/${recipe.author?._id}`}
                className="flex items-center hover:text-foodies-orange transition-colors"
              >
                {recipe.author?.avatar ? (
                  <img
                    src={recipe.author.avatar}
                    alt={recipe.author.name}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-gray-600">
                      {recipe.author?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{recipe.author?.name}</p>
                  <p className="text-sm text-gray-500">{recipe.author?.email}</p>
                </div>
              </Link>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {isAuthenticated && !isOwner && (
                  <Button
                    onClick={handleFavoriteClick}
                    variant={isFavorited ? 'default' : 'outline'}
                    size="sm"
                  >
                    {isFavorited ? 'Unfavorite' : 'Favorite'}
                  </Button>
                )}

                {isOwner && (
                  <Button variant="outline" size="sm">
                    Edit Recipe
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredients and Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ingredients */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Ingredients
            </h2>
            <ul className="space-y-3">
              {recipe.ingredients?.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-foodies-orange rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <span className="font-medium text-gray-900">
                      {item.measure}
                    </span>
                    <span className="text-gray-600 ml-2">
                      {item.ingredient?.name || item.name}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Instructions
            </h2>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {recipe.instructions}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;