const Inspection = require("../models/Inspection");

const generateInspectionId = () => {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  const random = Math.floor(
    1000 + Math.random() * 9000
  );

  return `ML-${year}${month}${day}-${random}`;
};


// CREATE INSPECTION
const createInspection = async (req, res) => {
  try {
    const {
      inspectorId,
      productName,
      brand,
      category,
      manufacturer,
      batchNumber,
    } = req.body;

    if (
      !inspectorId ||
      !productName ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Inspector, product name and category are required.",
      });
    }

    const inspectionId =
      generateInspectionId();

    const inspection =
      await Inspection.create({
        inspectionId,

        inspector: inspectorId,

        productName: productName.trim(),

        brand:
          brand?.trim() || "",

        category:
          category.trim(),

        manufacturer:
          manufacturer?.trim() || "",

        batchNumber:
          batchNumber?.trim() || "",

        status: "CAPTURE_PENDING",
      });

    return res.status(201).json({
      success: true,

      message:
        "Inspection created successfully.",

      inspection,
    });

  } catch (error) {
    console.error(
      "Create inspection error:",
      error.message
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to create inspection.",
    });
  }
};


// GET INSPECTIONS FOR INSPECTOR
const getInspections = async (req, res) => {
  try {
    const { inspectorId } = req.params;

    if (!inspectorId) {
      return res.status(400).json({
        success: false,
        message: "Inspector ID is required.",
      });
    }

    const inspections =
      await Inspection.find({
        inspector: inspectorId,
      })
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,

      count: inspections.length,

      inspections,
    });

  } catch (error) {
    console.error(
      "Get inspections error:",
      error.message
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch inspections.",
    });
  }
};

const uploadEvidence = async (req, res) => {
  try {
    const {
      inspectionId,
      side,
    } = req.body;

    if (!inspectionId || !side) {
      return res.status(400).json({
        success: false,
        message:
          "Inspection ID and package side are required.",
      });
    }

    const allowedSides = [
      "front",
      "back",
      "left",
      "right",
    ];

    if (!allowedSides.includes(side)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid package side.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Image file is required.",
      });
    }

    const inspection =
      await Inspection.findOne({
        inspectionId,
      });

    if (!inspection) {
      return res.status(404).json({
        success: false,
        message:
          "Inspection not found.",
      });
    }

    const imageUrl =
      `/uploads/${req.file.filename}`;

    inspection.evidence[side] = {
      url: imageUrl,
      originalName:
        req.file.originalname,
      capturedAt: new Date(),
    };

    inspection.packageSides[side] =
      true;

    inspection.status =
      "CAPTURE_PENDING";

    await inspection.save();

    return res.status(200).json({
      success: true,
      message:
        `${side} evidence uploaded successfully.`,
      evidence: {
        side,
        url: imageUrl,
        originalName:
          req.file.originalname,
        capturedAt:
          inspection.evidence[side]
            .capturedAt,
      },
      inspection,
    });
  } catch (error) {
    console.error(
      "Upload evidence error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to upload evidence.",
    });
  }
};


module.exports = {
  createInspection,
  getInspections,
  uploadEvidence,
};