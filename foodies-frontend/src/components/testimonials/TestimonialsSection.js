import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTestimonials } from '../../store/slices/testimonialsSlice';
import TestimonialCard from './TestimonialCard';
import LoadingSpinner from '../ui/LoadingSpinner';

const TestimonialsSection = () => {
  const dispatch = useDispatch();
  const { testimonials, loading, error } = useSelector(state => state.testimonials);

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">
            Error loading testimonials: {error}
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how Foodies has transformed the cooking experience for food lovers around the world
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial._id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;