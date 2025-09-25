import React from 'react';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Welcome to Foodies! 🍳
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Discover and share amazing recipes from around the world
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-2">Discover Recipes</h3>
            <p className="text-muted-foreground">
              Browse thousands of delicious recipes from our community
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-2">Share Your Creations</h3>
            <p className="text-muted-foreground">
              Upload your favorite recipes and inspire others to cook
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-2">Connect with Foodies</h3>
            <p className="text-muted-foreground">
              Follow other food enthusiasts and build your cooking network
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;