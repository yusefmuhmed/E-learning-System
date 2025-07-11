const multer = require("multer");
const path = require("path");
const fs = require("fs");


const uploadFolder = path.join(process.cwd(), "uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

console.log("[UPLOAD FOLDER]", uploadFolder); // Debug: See path

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
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
