import React from 'react';
import { cn } from '../../../utils/cn';

const Modal = ({ children, onClose, className }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div 
        className={cn(
          "relative bg-background border border-border rounded-lg shadow-modal max-h-[90vh] overflow-y-auto",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;