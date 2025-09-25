const express = require('express');
const { getCategories, getCategory } = require('../controllers/categoryController');

const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategory);

module.exports = router;