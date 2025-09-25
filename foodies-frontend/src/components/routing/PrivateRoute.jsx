import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Modal from '../common/Modal/Modal';
import SignInModal from '../modals/SignInModal';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [isSignInOpen, setIsSignInOpen] = useState(!isAuthenticated);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-semibold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to access this page.
          </p>
          <button
            onClick={() => setIsSignInOpen(true)}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90"
          >
            Sign In
          </button>
        </div>
        
        {isSignInOpen && (
          <Modal onClose={() => setIsSignInOpen(false)}>
            <SignInModal onClose={() => setIsSignInOpen(false)} />
          </Modal>
        )}
      </>
    );
  }

  return children;
};

export default PrivateRoute;