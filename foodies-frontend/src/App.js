import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuthStatus } from './store/slices/authSlice';

// Layout
import SharedLayout from './components/layout/SharedLayout';
import PrivateRoute from './components/routing/PrivateRoute';

// Pages
import HomePage from './pages/HomePage';
import RecipesPage from './pages/RecipesPage';
import RecipePage from './pages/RecipePage';
import AddRecipePage from './pages/AddRecipePage';
import UserPage from './pages/UserPage';
import EditProfilePage from './pages/EditProfilePage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          {/* Public Routes */}
          <Route index element={<HomePage />} />
          <Route path="recipes" element={<RecipesPage />} />
          <Route path="recipe/:id" element={<RecipePage />} />
          
          {/* Private Routes */}
          <Route path="add-recipe" element={
            <PrivateRoute>
              <AddRecipePage />
            </PrivateRoute>
          } />
          <Route path="user/:id" element={
            <PrivateRoute>
              <UserPage />
            </PrivateRoute>
          } />
          <Route path="edit-profile" element={
            <PrivateRoute>
              <EditProfilePage />
            </PrivateRoute>
          } />

          {/* Footer Pages */}
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="contact" element={<ContactPage />} />

          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;