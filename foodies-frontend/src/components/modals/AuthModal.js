import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Modal from '../common/Modal/Modal';
import LoginForm from '../forms/LoginForm';
import RegisterForm from '../forms/RegisterForm';

const AuthModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('login');

  const handleClose = () => {
    setActiveTab('login');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-lg"
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'login'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'register'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Forms */}
        <div className="space-y-4">
          {activeTab === 'login' ? (
            <LoginForm onSuccess={handleClose} />
          ) : (
            <RegisterForm onSuccess={handleClose} />
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          {activeTab === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setActiveTab('register')}
                className="text-foodies-orange hover:text-foodies-orange-dark font-medium"
              >
                Sign up here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setActiveTab('login')}
                className="text-foodies-orange hover:text-foodies-orange-dark font-medium"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;