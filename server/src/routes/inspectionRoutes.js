const express = require("express");

const {
  createInspection,
  getInspections,
  uploadEvidence,
  analyzeInspection,
} = require("../controllers/inspectionController");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();


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

module.exports = router;