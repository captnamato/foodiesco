import React from 'react';
import { useParams } from 'react-router-dom';

const UserPage = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <p className="text-muted-foreground">User ID: {id}</p>
      <p className="mt-4">This page will display user profile information and their recipes.</p>
    </div>
  );
};

export default UserPage;