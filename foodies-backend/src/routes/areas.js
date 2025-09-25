const express = require('express');
const { getAreas, getArea } = require('../controllers/areaController');
const router = express.Router();

router.get('/', getAreas);
router.get('/:id', getArea);

module.exports = router;