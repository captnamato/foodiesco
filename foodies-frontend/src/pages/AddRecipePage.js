import React from 'react';
import { useSelector } from 'react-redux';
import AddRecipeForm from '../components/forms/AddRecipeForm';
import { Navigate } from 'react-router-dom';

const AddRecipePage = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Recipe</h1>
          <p className="text-gray-600">Share your delicious recipe with the community</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <AddRecipeForm />
        </div>
      </div>
    </div>
  );
};

export default AddRecipePage;