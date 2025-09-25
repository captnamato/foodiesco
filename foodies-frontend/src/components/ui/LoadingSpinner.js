import React from 'react';
import { cn } from '../../utils/cn';

const LoadingSpinner = ({ className, size = 'default' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex justify-center items-center p-8">
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-200 border-t-foodies-orange',
          sizeClasses[size],
          className
        )}
        aria-label="Loading..."
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;