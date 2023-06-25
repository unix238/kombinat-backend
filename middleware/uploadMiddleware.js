// const multer = require('multer');
// const moment = require('moment');

import multer from "multer";
import moment from "moment";

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${moment().format("DDMMYYYY-HHmmss_SSS")}-${file.originalname}`);
  },
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const limits = {
  fileSize: 1024 * 1024 * 5,
};

// module.exports = multer({
//   storage,
//   fileFilter,
//   limits,
// });

export default multer({
  storage,
  fileFilter,
  limits,
});
