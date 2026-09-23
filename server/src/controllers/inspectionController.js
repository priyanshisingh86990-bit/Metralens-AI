const Inspection = require("../models/Inspection");
const path = require("path");
const { runInspectionAI } = require("../services/ai/aiOrchestrator");

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

const analyzeInspection = async (req, res) => {
  try {
    const { inspectionId } = req.params;

    const inspection = await Inspection.findOne({
      inspectionId,
    });

    if (!inspection) {
      return res.status(404).json({
        success: false,
        message: "Inspection not found",
      });
    }

    // -----------------------------------------
    // Collect available package images
    // -----------------------------------------

    const images = {};

    const sides = ["front", "back", "left", "right"];

    sides.forEach((side) => {
      const evidence = inspection.evidence?.[side];

      if (evidence?.url) {
        const filename = path.basename(evidence.url);

        images[side] = path.join(
          __dirname,
          "../../uploads",
          filename
        );
      }
    });

    if (Object.keys(images).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No package images available for analysis.",
      });
    }

    // -----------------------------------------
    // Mark analysis as processing
    // -----------------------------------------

    inspection.aiAnalysis.status = "PROCESSING";
    await inspection.save();

    console.log(
      `Starting AI analysis for ${inspectionId}`
    );

    // -----------------------------------------
    // Run AI orchestrator
    // -----------------------------------------

    const aiResult = await runInspectionAI(images);

    // -----------------------------------------
    // Save AI result
    // -----------------------------------------

    if (!aiResult.success) {
      inspection.aiAnalysis.status = "FAILED";
      inspection.aiAnalysis.result = aiResult;
      inspection.aiAnalysis.analyzedAt = new Date();

      await inspection.save();

      return res.status(500).json({
        success: false,
        message: "AI analysis failed",
        error: aiResult.error,
      });
    }

    inspection.aiAnalysis.status =
      aiResult.analysisStatus === "NEEDS_VERIFICATION"
        ? "NEEDS_VERIFICATION"
        : "COMPLETED";

    inspection.aiAnalysis.result = aiResult;
    inspection.aiAnalysis.analyzedAt = new Date();

    await inspection.save();

    return res.status(200).json({
      success: true,
      inspectionId,
      aiAnalysis: inspection.aiAnalysis,
    });
  } catch (error) {
    console.error(
      "Inspection AI analysis error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to analyze inspection",
      error: error.message,
    });
  }
};

const verifyInspection = async (req, res) => {
  try {
    const { inspectionId } = req.params;

    const inspection = await Inspection.findOne({ inspectionId });

    if (!inspection) {
      return res.status(404).json({
        success: false,
        message: "Inspection not found",
      });
    }

    // Save human verification
    inspection.humanVerification = {
      status: "VERIFIED",
      verifiedAt: new Date(),
      verifiedBy: req.body?.inspectorId || null,
    };

    // Final inspection status
    inspection.status = "PASSED";

    await inspection.save();

    return res.status(200).json({
      success: true,
      message: "Inspection verified successfully",
      inspection,
    });
  } catch (error) {
    console.error("Inspection verification failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify inspection",
      error: error.message,
    });
  }
};


module.exports = {
  createInspection,
  getInspections,
  analyzeInspection,
  uploadEvidence,
  verifyInspection,
};