const Testimonial = require('../models/Testimonial');

const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({})
      .populate('owner', 'name avatar')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTestimonials };