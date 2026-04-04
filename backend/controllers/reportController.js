const fs = require("fs");

const {
  insertReport,
  findVehicleByNumber,
} = require("../services/reportService");

const { verifyPlateWithImage } = require("../services/geminiService");

// ================= HELPERS =================
const normalizePlate = (value = "") =>
  value
    .toString()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

const removeFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, () => {});
  }
};

const cleanupReportFiles = (req) => {
  const plateImagePath = req.files?.plateImage?.[0]?.path;
  const supportImagePath = req.files?.supportImage?.[0]?.path;

  removeFile(plateImagePath);
  removeFile(supportImagePath);
};

const getUploadedReportFiles = (req) => ({
  plateImageFile: req.files?.plateImage?.[0] || null,
  supportImageFile: req.files?.supportImage?.[0] || null,
});

// ================= VERIFY PLATE ONLY =================
const verifyPlateImage = async (req, res) => {
  let uploadedPath = null;

  try {
    const plate = normalizePlate(req.body?.plate);
    const plateImageFile = req.file;

    if (!plate || !plateImageFile) {
      return res.status(400).json({
        matched: false,
        extractedPlate: "",
        message: "Plate and plate image are required.",
      });
    }

    uploadedPath = plateImageFile.path;

    const result = await verifyPlateWithImage(
      plate,
      uploadedPath,
      plateImageFile.mimetype,
    );

    return res.status(result.matched ? 200 : 400).json({
      matched: result.matched,
      extractedPlate: result.extractedPlate || "",
      message: result.matched
        ? "Plate matched successfully."
        : "Plate did not match. Please retake the image.",
    });
  } catch (error) {
    return res.status(500).json({
      matched: false,
      extractedPlate: "",
      message: error.message || "Plate verification failed.",
    });
  } finally {
    removeFile(uploadedPath);
  }
};

// ================= CREATE REPORT =================
const createReport = async (req, res) => {
  try {
    const userId = req.user.userId;

    const plate = normalizePlate(req.body?.plate);
    const violationType = req.body?.violationType?.trim();
    const description = req.body?.description?.trim();
    const latitude = req.body?.latitude;
    const longitude = req.body?.longitude;

    const { plateImageFile, supportImageFile } = getUploadedReportFiles(req);

    // ================= SIMPLE COMBINED VALIDATION =================
    if (
      !plate ||
      !violationType ||
      !description ||
      latitude === undefined ||
      latitude === null ||
      latitude === "" ||
      longitude === undefined ||
      longitude === null ||
      longitude === "" ||
      !plateImageFile ||
      !supportImageFile
    ) {
      cleanupReportFiles(req);
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });
    }

    // ================= VALIDATE NUMBERS =================
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      cleanupReportFiles(req);
      return res.status(400).json({
        message: "Invalid location coordinates.",
      });
    }

    // ================= VERIFY PLATE =================
    const verification = await verifyPlateWithImage(
      plate,
      plateImageFile.path,
      plateImageFile.mimetype,
    );

    if (!verification.matched) {
      cleanupReportFiles(req);
      return res.status(400).json({
        message: "Plate does not match. Please retake the image.",
        extractedPlate: verification.extractedPlate || "",
      });
    }

    // ================= FIND VEHICLE =================
    const vehicleRows = await new Promise((resolve, reject) => {
      findVehicleByNumber(plate, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    if (!vehicleRows.length) {
      cleanupReportFiles(req);
      return res.status(404).json({
        message: "Vehicle not found.",
      });
    }

    const plateImage = `/uploads/plateImages/${plateImageFile.filename}`;
    const supportImage = `/uploads/supportImages/${supportImageFile.filename}`;

    // ================= INSERT REPORT =================
    await new Promise((resolve, reject) => {
      insertReport(
        {
          userId,
          vehicleId: vehicleRows[0].vehicle_id,
          violationType,
          description,
          latitude: lat,
          longitude: lng,
          plateImage,
          supportImage,
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        },
      );
    });

    return res.status(201).json({
      message: "Report submitted successfully.",
    });
  } catch (error) {
    cleanupReportFiles(req);
    return res.status(500).json({
      message: "Server error.",
    });
  }
};

module.exports = {
  createReport,
  verifyPlateImage,
};
