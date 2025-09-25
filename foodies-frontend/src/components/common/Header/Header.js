import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../store/slices/authSlice';
import Button from '../../ui/Button';
import AuthModal from '../../modals/AuthModal';
import { cn } from '../../../utils/cn';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/recipes', label: 'Recipes' },
    ...(isAuthenticated ? [{ to: '/add-recipe', label: 'Add Recipe' }] : [])
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-foodies-orange rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Foodies</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-600 hover:text-foodies-orange visited:text-gray-500 focus:text-foodies-orange transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={`/user/${user?.id}`}
                  className="flex items-center space-x-2 text-gray-700 hover:text-foodies-orange visited:text-gray-600 focus:text-foodies-orange transition-colors"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span>{user?.name}</span>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={() => setAuthModalOpen(true)}>
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center">
              <span
                className={cn(
                  'bg-gray-600 h-0.5 w-6 rounded-sm transition-all duration-300',
                  mobileMenuOpen ? 'rotate-45 translate-y-0.5' : 'mb-1'
                )}
              />
              <span
                className={cn(
                  'bg-gray-600 h-0.5 w-6 rounded-sm transition-all duration-300',
                  mobileMenuOpen ? 'opacity-0' : 'mb-1'
                )}
              />
              <span
                className={cn(
                  'bg-gray-600 h-0.5 w-6 rounded-sm transition-all duration-300',
                  mobileMenuOpen ? '-rotate-45 -translate-y-0.5' : ''
                )}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          'md:hidden overflow-hidden transition-all duration-300',
          mobileMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
        )}>
          <div className="flex flex-col space-y-4">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-600 hover:text-foodies-orange visited:text-gray-500 focus:text-foodies-orange py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Link
                  to={`/user/${user?.id}`}
                  className="text-gray-700 hover:text-foodies-orange visited:text-gray-600 focus:text-foodies-orange py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-gray-600 py-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  setAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="mt-4"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </header>
  );
};

export default Header;