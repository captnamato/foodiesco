import React from 'react';
import { cn } from '../../utils/cn';

const ErrorMessage = ({ message, className, variant = 'default' }) => {
  const variants = {
    default: 'bg-red-50 text-red-800 border-red-200',
    destructive: 'bg-red-500 text-white',
  };

  return (
    <div className={cn(
      'border rounded-lg p-4 text-center',
      variants[variant],
      className
    )}>
      <p className="font-medium">{message}</p>
    </div>
  );
};

export default ErrorMessage;