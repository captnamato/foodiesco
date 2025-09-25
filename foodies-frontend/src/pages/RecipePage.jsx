import React from 'react';
import { useParams } from 'react-router-dom';

const RecipePage = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Recipe Details</h1>
      <p className="text-muted-foreground">Recipe ID: {id}</p>
      <p className="mt-4">This page will display detailed recipe information.</p>
    </div>
  );
};

export default RecipePage;