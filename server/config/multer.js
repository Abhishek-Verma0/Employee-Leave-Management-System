const multer = require("multer");

const allowedTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(
      "Only PNG, JPG, JPEG, and PDF files are allowed"
    );
    error.statusCode = 400;
    cb(error, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // ✅ 2MB
  },
  fileFilter,
});

module.exports = upload;