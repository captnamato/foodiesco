import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipeById } from '../store/slices/recipesSlice';
import RecipeDetail from '../components/recipe/RecipeDetail';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const RecipePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentRecipe, loading, error } = useSelector(state => state.recipes);

  useEffect(() => {
    if (id) {
      dispatch(fetchRecipeById(id));
    }
  }, [dispatch, id]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!currentRecipe) {
    return <ErrorMessage message="Recipe not found" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <RecipeDetail recipe={currentRecipe} />
    </div>
  );
};

export default RecipePage;