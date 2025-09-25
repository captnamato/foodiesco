# Foodies Frontend - Updated Implementation with Design System

## Updated Tailwind Configuration

Based on your design spec, here's the updated Tailwind configuration:

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        cardForeground: "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        popoverForeground: "hsl(var(--popover-foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        danger: "hsl(var(--danger))",
        info: "hsl(var(--info))",
        muted: "hsl(var(--muted))",
        mutedForeground: "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        destructive: "hsl(var(--destructive))",
        destructiveForeground: "hsl(var(--destructive-foreground))",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.5' }],
        base: ['1rem', { lineHeight: '1.5' }],
        lg: ['1.125rem', { lineHeight: '1.5' }],
        xl: ['1.25rem', { lineHeight: '1.3' }],
        '2xl': ['1.5rem', { lineHeight: '1.3' }],
        '3xl': ['1.875rem', { lineHeight: '1.3' }],
        '4xl': ['2.25rem', { lineHeight: '1.3' }],
      },
      borderRadius: {
        xs: "6px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        full: "9999px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.06)",
        float: "0 6px 16px rgba(0,0,0,0.10)",
        modal: "0 10px 30px rgba(0,0,0,0.22)",
      },
      transitionTimingFunction: {
        kinetic: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
      transitionDuration: {
        fast: "120ms",
        base: "180ms",
        slow: "240ms",
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
}
```

### src/index.css (CSS Variables)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Brand - Foodies Orange */
    --primary: 22 100% 54%;   /* #FF6B2C */
    --primary-foreground: 0 0% 100%;

    /* Accents */
    --success: 142 72% 35%;   /* #22C55E */
    --warning: 38 92% 50%;    /* #F59E0B */
    --danger: 0 84% 60%;      /* #EF4444 */
    --info: 199 89% 48%;      /* #0EA5E9 */

    /* Neutrals */
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
    --muted: 215 16% 92%;
    --muted-foreground: 215 15% 35%;

    /* Surfaces */
    --card: 0 0% 100%;
    --card-foreground: var(--foreground);
    --popover: 0 0% 100%;
    --popover-foreground: var(--foreground);

    /* Outlines & dividers */
    --border: 215 16% 86%;
    --input: 214 15% 85%;
    --ring: var(--primary);

    /* Overlays */
    --overlay: 0 0% 0% / 0.5;

    /* Destructive */
    --destructive: var(--danger);
    --destructive-foreground: 0 0% 100%;
  }

  .dark {
    --background: 222 47% 7%;
    --foreground: 0 0% 98%;
    --muted: 223 14% 14%;
    --muted-foreground: 215 20% 70%;
    --card: 223 14% 12%;
    --card-foreground: var(--foreground);
    --popover: 223 14% 12%;
    --popover-foreground: var(--foreground);
    --border: 223 13% 20%;
    --input: 223 13% 20%;
    --ring: 22 100% 60%;
    --overlay: 0 0% 0% / 0.6;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-sans;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

## Updated Component Examples

### Button Component (src/components/ui/Button.jsx)

```javascript
import React, { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium rounded-md transition-[background,box-shadow,transform] duration-base ease-kinetic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        solid: "bg-primary text-primary-foreground hover:bg-[hsl(var(--primary)/0.9)] active:translate-y-[0.5px] shadow-soft",
        outline: "border border-border text-foreground hover:bg-muted",
        soft: "bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.15)]",
        ghost: "text-foreground hover:bg-muted",
        link: "text-[hsl(var(--primary))] underline-offset-4 hover:underline p-0 h-auto",
        destructive: "bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:bg-[hsl(var(--destructive)/0.9)]",
      },
      size: {
        sm: "h-7 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  }
);

const Button = forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
```

### Input Component (src/components/ui/Input.jsx)

```javascript
import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full h-10 px-3 rounded-md border border-input bg-background text-foreground placeholder:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition duration-fast ease-kinetic",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
```

### Card Component (src/components/ui/Card.jsx)

```javascript
import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Card = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg bg-card text-card-foreground border border-border shadow-soft",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 pb-0 md:p-6 md:pb-0 flex items-center justify-between", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("p-4 md:p-6", className)} 
    {...props} 
  />
));
CardContent.displayName = "CardContent";

const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 pt-0 md:p-6 md:pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
```

### Updated Header Component (src/components/common/Header/Header.jsx)

```javascript
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { cn } from '../../../utils/cn';
import Logo from './Logo';
import Nav from './Nav';
import AuthBar from './AuthBar';
import UserBar from './UserBar';
import MobileMenu from './MobileMenu';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user && <Nav currentPath={location.pathname} />}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? <UserBar /> : <AuthBar />}
            
            {/* Mobile menu button */}
            {user && (
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-foreground hover:bg-muted rounded-md transition-colors"
                aria-label="Toggle mobile menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && (
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
          currentPath={location.pathname}
        />
      )}
    </header>
  );
};

export default Header;
```

### Updated Recipe Card Component (src/components/cards/RecipeCard.jsx)

```javascript
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToFavorites, removeFromFavorites } from '../../store/slices/recipesSlice';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import Modal from '../common/Modal/Modal';
import SignInModal from '../modals/SignInModal';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';

const RecipeCard = ({ recipe, className }) => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isFavorited = user && recipe.favoritedBy?.includes(user.id);

  const handleAuthorClick = () => {
    if (!user) {
      setIsSignInOpen(true);
      return;
    }
    navigate(`/user/${recipe.author.id}`);
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      setIsSignInOpen(true);
      return;
    }

    setIsFavoriteLoading(true);
    try {
      if (isFavorited) {
        await dispatch(removeFromFavorites(recipe._id)).unwrap();
        toast.success('Recipe removed from favorites');
      } else {
        await dispatch(addToFavorites(recipe._id)).unwrap();
        toast.success('Recipe added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  return (
    <>
      <Card className={cn("group hover:shadow-float transition-shadow duration-base", className)}>
        {/* Recipe Image */}
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={recipe.image || '/placeholder-recipe.jpg'}
            alt={recipe.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-slow"
          />
          
          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavoriteClick}
            disabled={isFavoriteLoading}
            className={cn(
              "absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur hover:bg-background/90",
              isFavorited ? "text-danger" : "text-muted-foreground hover:text-danger"
            )}
          >
            <svg
              className="w-5 h-5"
              fill={isFavorited ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </Button>
        </div>

        <CardContent>
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
            {recipe.title}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {recipe.description}
          </p>

          {/* Author Info */}
          <Button
            variant="ghost"
            onClick={handleAuthorClick}
            className="flex items-center space-x-3 mb-4 p-2 rounded-lg transition-colors w-full justify-start h-auto"
          >
            <img
              src={recipe.author?.avatar || '/default-avatar.png'}
              alt={recipe.author?.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-foreground">
              {recipe.author?.name}
            </span>
          </Button>

          {/* Footer */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{recipe.cookingTime} min</span>
            </div>
            
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/recipe/${recipe._id}`}>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m0-4H3"
                  />
                </svg>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sign In Modal */}
      {isSignInOpen && (
        <Modal onClose={() => setIsSignInOpen(false)}>
          <SignInModal
            onClose={() => setIsSignInOpen(false)}
            onSwitchToSignUp={() => setIsSignInOpen(false)}
          />
        </Modal>
      )}
    </>
  );
};

export default RecipeCard;
```

### Utility Function (src/utils/cn.js)

```javascript
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

## Installation Requirements

Add these additional dependencies for the design system:

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Key Updates Made

1. **Color System**: Updated to use your Foodies Orange (#FF6B2C) as primary color
2. **Component Architecture**: Implemented your component variants system
3. **CSS Variables**: Added all your design tokens as CSS custom properties
4. **Tailwind Config**: Updated to map to your design system
5. **Button Variants**: Implemented solid, outline, soft, ghost, link, and destructive variants
6. **Typography**: Updated to use Inter font family with your specified scale
7. **Shadows**: Added soft, float, and modal shadow variants
8. **Motion**: Added your custom easing and duration tokens
9. **Responsive**: Maintained mobile-first approach with your breakpoints

This implementation now matches your Figma design system exactly. All components use the design tokens you specified, ensuring consistency across the entire application.

Would you like me to update any other specific components or add additional UI elements from your design system?