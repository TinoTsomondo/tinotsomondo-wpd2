// middlewares/upload.js

const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: './public/media/', // Set your destination folder
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// Initialize multer
const upload = multer({
  storage: storage,
});

module.exports = upload;
