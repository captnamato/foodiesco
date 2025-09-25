const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Ensure upload directories exist
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';

    if (file.fieldname === 'avatar') {
      uploadPath = 'uploads/avatars/';
    } else if (file.fieldname === 'image') {
      uploadPath = 'uploads/recipes/';
    }

    // Ensure directory exists
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    try {
      const uniqueId = uuidv4();
      const ext = path.extname(file.originalname);
      const fileName = `${uniqueId}${ext}`;
      cb(null, fileName);
    } catch (error) {
      cb(error);
    }
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedMimeTypes.includes(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    const error = new Error('Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed');
    error.code = 'INVALID_FILE_TYPE';
    cb(error);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB default
    files: 1 // Only allow 1 file per request
  },
  onError: (err, next) => {
    console.error('Multer error:', err);
    next(err);
  }
});

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 5MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files. Only one file allowed per upload.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: 'Unexpected field name for file upload.'
      });
    }
  }

  if (error.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }

  next(error);
};

module.exports = upload;
module.exports.handleMulterError = handleMulterError;