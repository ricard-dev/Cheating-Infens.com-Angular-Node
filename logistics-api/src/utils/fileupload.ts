import config from "./config";
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require("multer");
const path = require("path");

const s3 = new aws.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region,
  bucket: config.aws.bucket
});

const storage = multerS3({
  s3: s3,
  bucket: config.aws.bucket,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: function(req: any, file: any, cb: any) {
    let fname =
      path.basename(file.originalname, path.extname(file.originalname)) +
      "-" +
      Date.now() +
      path.extname(file.originalname);
    cb(null, fname);
  }
});

const pdfUpload = multer({
  storage,
  limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
  fileFilter: function(req: any, file: any, cb: any) {
    checkPDF(file, cb);
  }
});

const imageUpload = multer({
  storage,
  limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
  fileFilter: function(req: any, file: any, cb: any) {
    checkImage(file, cb);
  }
});

function checkPDF(file: any, cb: any) {
  const filetypes = /pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: pdf only");
  }
}

function checkImage(file: any, cb: any) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: image only");
  }
}

module.exports = {
  pdfUpload,
  imageUpload
};
