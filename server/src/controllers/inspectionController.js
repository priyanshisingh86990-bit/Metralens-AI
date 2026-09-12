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
        brand: brand?.trim() || "",
        category: category.trim(),
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


module.exports = {
  createInspection,
};