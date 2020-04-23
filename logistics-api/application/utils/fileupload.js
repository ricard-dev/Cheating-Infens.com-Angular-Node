"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require("multer");
const path = require("path");
const s3 = new aws.S3({
    accessKeyId: config_1.default.aws.accessKeyId,
    secretAccessKey: config_1.default.aws.secretAccessKey,
    region: config_1.default.aws.region,
    bucket: config_1.default.aws.bucket
});
const storage = multerS3({
    s3: s3,
    bucket: config_1.default.aws.bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
        let fname = path.basename(file.originalname, path.extname(file.originalname)) +
            "-" +
            Date.now() +
            path.extname(file.originalname);
        cb(null, fname);
    }
});
const pdfUpload = multer({
    storage,
    limits: { fileSize: 2000000 },
    fileFilter: function (req, file, cb) {
        checkPDF(file, cb);
    }
});
const imageUpload = multer({
    storage,
    limits: { fileSize: 2000000 },
    fileFilter: function (req, file, cb) {
        checkImage(file, cb);
    }
});
function checkPDF(file, cb) {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb("Error: pdf only");
    }
}
function checkImage(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb("Error: image only");
    }
}
module.exports = {
    pdfUpload,
    imageUpload
};
