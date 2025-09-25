import React from 'react';
import { cn } from '../../utils/cn';

const Pagination = ({ currentPage, totalPages, onPageChange, className = '' }) => {
  // Calculate which pages to show
  const getPageNumbers = () => {
    const delta = 2;
    const pages = [];
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    if (currentPage - delta > 2) {
      pages.push(1, '...');
    } else {
      pages.push(1);
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (currentPage + delta < totalPages - 1) {
      pages.push('...', totalPages);
    } else if (totalPages > 1) {
      pages.push(totalPages);
    }

    return [...new Set(pages)]; // Remove duplicates
  };

  if (totalPages <= 1) return null;

  const pages = getPageNumbers();

  return (
    <div className={cn('flex justify-center items-center space-x-1', className)}>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          'border border-gray-300',
          currentPage === 1
            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
            : 'text-gray-700 bg-white hover:bg-gray-50 hover:text-foodies-orange'
        )}
      >
        Previous
      </button>

      {/* Page Numbers */}
      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              'border border-gray-300',
              currentPage === page
                ? 'bg-foodies-orange text-white border-foodies-orange'
                : 'text-gray-700 bg-white hover:bg-gray-50 hover:text-foodies-orange'
            )}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          'border border-gray-300',
          currentPage === totalPages
            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
            : 'text-gray-700 bg-white hover:bg-gray-50 hover:text-foodies-orange'
        )}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;