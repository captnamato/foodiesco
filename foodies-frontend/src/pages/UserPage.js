import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById } from '../store/slices/usersSlice';
import { fetchRecipesByUser } from '../store/slices/recipesSlice';
import UserProfile from '../components/user/UserProfile';
import UserRecipes from '../components/user/UserRecipes';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const UserPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector(state => state.users);
  const { userRecipes, loading: recipesLoading } = useSelector(state => state.recipes);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
      dispatch(fetchRecipesByUser(id));
    }
  }, [dispatch, id]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!currentUser) {
    return <ErrorMessage message="User not found" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <UserProfile user={currentUser} />
        <div className="mt-8">
          <UserRecipes
            recipes={userRecipes}
            loading={recipesLoading}
            userId={id}
          />
        </div>
      </div>
    </div>
  );
};

export default UserPage;