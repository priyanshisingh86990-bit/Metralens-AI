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

    evidence: {
      front: {
        url: {
          type: String,
          default: "",
        },
        originalName: {
          type: String,
          default: "",
        },
        capturedAt: {
          type: Date,
          default: null,
        },
      },

      back: {
        url: {
          type: String,
          default: "",
        },
        originalName: {
          type: String,
          default: "",
        },
        capturedAt: {
          type: Date,
          default: null,
        },
      },

      left: {
        url: {
          type: String,
          default: "",
        },
        originalName: {
          type: String,
          default: "",
        },
        capturedAt: {
          type: Date,
          default: null,
        },
      },

      right: {
        url: {
          type: String,
          default: "",
        },
        originalName: {
          type: String,
          default: "",
        },
        capturedAt: {
          type: Date,
          default: null,
        },
      },
    },
    aiAnalysis: {
      status: {
        type: String,
        enum: [
          "NOT_STARTED",
          "PROCESSING",
          "COMPLETED",
          "NEEDS_VERIFICATION",
          "FAILED",
        ],
        default: "NOT_STARTED",
      },

      result: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },

      analyzedAt: {
        type: Date,
        default: null,
      },
    },

    humanVerification: {
      status: {
        type: String,
        enum: ["NOT_VERIFIED", "VERIFIED"],
        default: "NOT_VERIFIED",
      },
      verifiedAt: {
        type: Date,
        default: null,
      },
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
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