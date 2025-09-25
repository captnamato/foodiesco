import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthModal from '../modals/AuthModal';

const TestimonialCard = ({ testimonial }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleCardClick = () => {
    if (testimonial.owner && testimonial.owner._id) {
      if (isAuthenticated) {
        // Navigate to user profile if authenticated and owner exists
        navigate(`/user/${testimonial.owner._id}`);
      } else {
        // Show auth modal for unregistered users
        setAuthModalOpen(true);
      }
    } else if (!isAuthenticated) {
      // Show auth modal if not authenticated and no owner
      setAuthModalOpen(true);
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Quote Icon */}
      <div className="mb-4">
        <svg
          className="w-8 h-8 text-foodies-orange"
          fill="currentColor"
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
        </svg>
      </div>

      {/* Testimonial Text */}
      <blockquote className="text-gray-700 mb-6 leading-relaxed">
        "{testimonial.text}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-foodies-orange to-foodies-orange-dark rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {testimonial.owner?.name ?
            testimonial.owner.name.charAt(0).toUpperCase() :
            testimonial.name.charAt(0).toUpperCase()
          }
        </div>
        <div className="ml-3">
          <div className="font-semibold text-gray-900">
            {testimonial.owner?.name || testimonial.name}
          </div>
          <div className="text-sm text-gray-500">
            {testimonial.owner ? 'Verified User' : 'Foodies User'}
          </div>
        </div>
      </div>

      {/* Rating Stars */}
      <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="w-4 h-4 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>
        <span className="ml-2 text-sm text-gray-500">5.0</span>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default TestimonialCard;