const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const verifyToken = require("../middleware/authMiddleware");
const { createReport } = require("../controllers/reportController");

// ================= ENSURE FOLDER =================
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// ================= MULTER CONFIG =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = "uploads/";

    if (file.fieldname === "plateImage") {
      dir = "uploads/plateImages/";
    } else if (file.fieldname === "supportImage") {
      dir = "uploads/supportImages/";
    }

    ensureDir(dir); // auto-create folder
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${file.fieldname}${path.extname(
      file.originalname,
    )}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);

  if (ext && mime) return cb(null, true);
  cb(new Error("Only image files are allowed."));
};

const upload = multer({ storage, fileFilter });

// ================= ROUTE =================
router.post(
  "/report",
  verifyToken,
  upload.fields([
    { name: "plateImage", maxCount: 1 },
    { name: "supportImage", maxCount: 1 },
  ]),
  createReport,
);

module.exports = router;
