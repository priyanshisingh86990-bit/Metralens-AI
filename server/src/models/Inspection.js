const mongoose = require("mongoose");

const inspectionSchema = new mongoose.Schema(
  {
    inspectionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    inspector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    manufacturer: {
      type: String,
      trim: true,
      default: "",
    },

    batchNumber: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "DRAFT",
        "CAPTURE_PENDING",
        "ANALYSIS_PENDING",
        "COMPLETED",
      ],
      default: "CAPTURE_PENDING",
    },

    packageSides: {
      front: {
        type: Boolean,
        default: false,
      },
      back: {
        type: Boolean,
        default: false,
      },
      left: {
        type: Boolean,
        default: false,
      },
      right: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Inspection",
  inspectionSchema
);