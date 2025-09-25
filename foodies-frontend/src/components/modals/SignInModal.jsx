import React from 'react';

const SignInModal = ({ onClose }) => {
  return (
    <div className="p-6 w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Sign In to Foodies</h2>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input 
            type="email" 
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter your email"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input 
            type="password" 
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter your password"
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Sign In
        </button>
      </form>
      
      <div className="text-center mt-4">
        <button 
          onClick={onClose}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SignInModal;