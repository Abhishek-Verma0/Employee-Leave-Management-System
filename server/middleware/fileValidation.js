const allowedTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
];

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const fileValidation = (req, res, next) => {
  if (!req.file) return next();

  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      success: false,
      message: "Invalid file type",
    });
  }

  if (req.file.size > MAX_FILE_SIZE) {
    return res.status(400).json({
      success: false,
      message: "File size exceeds 2MB",
    });
  }

  next();
};

module.exports = fileValidation;