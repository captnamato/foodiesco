import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchRecipes } from '../store/slices/recipesSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';
import RecipeCard from '../components/cards/RecipeCard';
import HeroSection from '../components/home/HeroSection';
import CategoryFilter from '../components/common/CategoryFilter';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import TestimonialsSection from '../components/testimonials/TestimonialsSection';

const HomePage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { recipes, loading, error } = useSelector(state => state.recipes);
  const { categories } = useSelector(state => state.categories);

  const selectedCategoryId = searchParams.get('category') || '';
  const selectedCategoryName = categories?.find(cat => cat._id === selectedCategoryId)?.name || '';

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      limit: 12,
      ...(selectedCategoryId && { category: selectedCategoryId })
    };
    dispatch(fetchRecipes(params));
  }, [dispatch, selectedCategoryId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen">
      <HeroSection />

      <div className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Browse Recipes</h2>
          {categories && categories.length > 0 && <CategoryFilter categories={categories} />}
        </section>

        <section>
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            {selectedCategoryName ? `${selectedCategoryName} Recipes` : 'Latest Recipes'}
          </h3>
          {error && (
            <div className="text-red-600 text-center py-4">
              Error loading recipes: {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes && recipes.map(recipe => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>

          {recipes && recipes.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No recipes found.</p>
            </div>
          )}
        </section>
      </div>

      {/* Testimonials Section */}
      <TestimonialsSection />
    </div>
  );
};

export default HomePage;