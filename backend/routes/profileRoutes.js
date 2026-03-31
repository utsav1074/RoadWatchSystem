const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const verifyToken = require("../middleware/authMiddleware");
const {
  getProfile,
  uploadProfileImage,
  linkVehicle,
  unlinkVehicle,
} = require("../controllers/profileController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
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

router.get("/", verifyToken, getProfile);
router.post(
  "/image",
  verifyToken,
  upload.single("profileImage"),
  uploadProfileImage,
);
router.post("/vehicle/link", verifyToken, linkVehicle);
router.delete("/vehicle/:vehicleId", verifyToken, unlinkVehicle);

module.exports = router;
