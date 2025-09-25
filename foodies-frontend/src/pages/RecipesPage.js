import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes } from '../store/slices/recipesSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';
import RecipeCard from '../components/cards/RecipeCard';
import CategoryFilter from '../components/common/CategoryFilter';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import Pagination from '../components/ui/Pagination';

const RecipesPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12;

  const { recipes, loading, error, pagination } = useSelector(state => state.recipes);
  const { categories } = useSelector(state => state.categories);

  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      page: currentPage,
      limit,
      ...(selectedCategory && { category: selectedCategory }),
      ...(searchQuery && { search: searchQuery })
    };

    dispatch(fetchRecipes(params));
  }, [dispatch, currentPage, selectedCategory, searchQuery]);

  const handleCategoryChange = (category) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set('category', category);
      params.delete('search'); // Clear search when selecting category
    } else {
      params.delete('category');
    }
    params.delete('page'); // Reset to first page
    setSearchParams(params);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    params.delete('page'); // Reset to first page
    setSearchParams(params);
    setCurrentPage(1);
  };

  if (loading && (!recipes || !recipes.length)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Discover Amazing Recipes
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our collection of delicious recipes from around the world
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search recipes..."
            defaultValue={searchQuery}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foodies-orange focus:border-transparent"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(e.target.value);
              }
            }}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-8">
          <ErrorMessage message={error} />
        </div>
      )}

      {/* Results Info */}
      {pagination && (
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {recipes ? recipes.length : 0} of {pagination ? pagination.total : 0} recipes
            {selectedCategory && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
      )}

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {recipes && recipes.map(recipe => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>

      {/* Loading State for Pagination */}
      {loading && recipes && recipes.length > 0 && (
        <div className="flex justify-center py-4">
          <LoadingSpinner />
        </div>
      )}

      {/* Empty State */}
      {!loading && recipes && recipes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
          <p className="text-gray-500 mb-4">
            {selectedCategory || searchQuery
              ? "Try adjusting your search or filter criteria"
              : "Be the first to add a recipe to our collection"
            }
          </p>
          {(selectedCategory || searchQuery) && (
            <button
              onClick={() => {
                setSearchParams({});
                setCurrentPage(1);
              }}
              className="text-foodies-orange hover:text-foodies-orange-dark font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default RecipesPage;