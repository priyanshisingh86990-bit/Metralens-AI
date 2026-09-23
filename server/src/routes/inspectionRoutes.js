const express = require("express");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();
const {
  createInspection,
  getInspections,
  uploadEvidence,
  analyzeInspection,
  verifyInspection,
} = require("../controllers/inspectionController");

// CREATE INSPECTION
router.post(
  "/",
  createInspection
);


// GET INSPECTIONS
router.get(
  "/:inspectorId",
  getInspections
);

router.post(
  "/evidence",
  upload.single("image"),
  uploadEvidence
);

router.post("/:inspectionId/analyze", analyzeInspection);

router.post("/:inspectionId/verify", verifyInspection);

module.exports = router;