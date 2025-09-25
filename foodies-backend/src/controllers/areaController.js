const Area = require('../models/Area');

const getAreas = async (req, res, next) => {
  try {
    const areas = await Area.find({}).sort({ name: 1 });
    res.status(200).json({ success: true, count: areas.length, data: areas });
  } catch (error) {
    next(error);
  }
};

const getArea = async (req, res, next) => {
  try {
    const area = await Area.findById(req.params.id);
    if (!area) {
      return res.status(404).json({ success: false, error: 'Area not found' });
    }
    res.status(200).json({ success: true, data: area });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAreas, getArea };