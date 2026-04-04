const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const verifyToken = require("../middleware/authMiddleware");
const {
  createReport,
  verifyPlateImage,
} = require("../controllers/reportController");

// ================= ENSURE FOLDER =================
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// ================= FILE FILTER =================
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpg|jpeg|png|webp/;
  const extensionOk = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimeOk = /^image\/(jpeg|jpg|png|webp)$/.test(file.mimetype);

  if (extensionOk && mimeOk) {
    return cb(null, true);
  }

  cb(new Error("Only image files are allowed."));
};

// ================= STORAGE =================
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/temp/";
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${file.fieldname}${path.extname(
      file.originalname,
    )}`;
    cb(null, uniqueName);
  },
});

const reportStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = "uploads/temp/";

    if (file.fieldname === "plateImage") {
      dir = "uploads/plateImages/";
    }

    if (file.fieldname === "supportImage") {
      dir = "uploads/supportImages/";
    }

    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${file.fieldname}${path.extname(
      file.originalname,
    )}`;
    cb(null, uniqueName);
  },
});

const verifyUpload = multer({ storage: tempStorage, fileFilter });
const reportUpload = multer({ storage: reportStorage, fileFilter });

// ================= VERIFY PLATE IMAGE ONLY =================
router.post(
  "/report/verify-plate",
  verifyToken,
  verifyUpload.single("plateImage"),
  verifyPlateImage,
);

// ================= CREATE REPORT =================
router.post(
  "/report",
  verifyToken,
  reportUpload.fields([
    { name: "plateImage", maxCount: 1 },
    { name: "supportImage", maxCount: 1 },
  ]),
  createReport,
);

module.exports = router;
