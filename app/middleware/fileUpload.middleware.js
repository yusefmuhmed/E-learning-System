const multer = require("multer");
const path = require("path");

// Define storage strategy
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory where images will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

// Filter for image files only
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(
      new Error(
        "File upload only supports the following filetypes => jpeg, jpg, png"
      ),
      false
    );
  }
};

// Upload settings
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
  fileFilter: fileFilter,
}).single("image");

// Middleware for handling file upload
const uploadMiddleware = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred (e.g., file size limit exceeded)
      return res.status(400).json(err.message);
    } else if (err) {
      // An unknown error occurred when uploading
      return res.status(400).json(err.message);
    }

    // File uploaded successfully
    // if (!req.file) {
    //   return res
    //     .status(400)
    //     .json("No file uploaded or file format is incorrect");
    // }

    // Proceed to the next middleware if everything is okay
    next();
  });
};

module.exports = uploadMiddleware;
