const path = require("path");

const { analyzeImage } = require("./aiAnalyzer");
const { extractTextFromImage } = require("./ocrService");
const { runFallbackAnalysis } = require("./fallbackAnalyzer");
const { calculateConfidence } = require("./confidence");
const { mapEvidence } = require("./evidenceMapper");
const { analyzeCrossPanel } = require("./crossPanelAnalyzer");

const runInspectionAI = async (images) => {
  try {
    console.log("\n========================================");
    console.log("METRALENS AI ORCHESTRATOR");
    console.log("========================================\n");

    const panelResults = {};
    const evidence = [];

    // -----------------------------------------
    // STEP 1: Analyze every available panel
    // -----------------------------------------

    for (const [side, imagePath] of Object.entries(images)) {
      if (!imagePath) {
        continue;
      }

      const absolutePath = path.resolve(imagePath);

      console.log(`\nAnalyzing ${side} panel...`);

      let result = await analyzeImage(absolutePath);

      // -----------------------------------------
      // GEMINI FALLBACK
      // -----------------------------------------

      if (!result.success) {
        console.warn(
          `\nGemini analysis unavailable for ${side}.`
        );

        console.warn(
          "Switching to LOCAL OCR FALLBACK..."
        );

        try {
          const ocrResult =
            await extractTextFromImage(absolutePath);

          if (!ocrResult.success) {
            console.warn(
              "OCR fallback also failed."
            );

            result = {
              success: true,
              source: "LOCAL_FALLBACK",
              analysisStatus: "NEEDS_VERIFICATION",

              analysis: {
                product: {
                  name: "",
                  brand: "",
                  category: "",
                },

                declarations: {},

                missingDeclarations: [
                  "manufacturer",
                  "packer",
                  "importer",
                  "netQuantity",
                  "mrp",
                  "batchNumber",
                  "manufacturingDate",
                  "expiryDate",
                  "consumerCare",
                  "countryOfOrigin",
                ],

                uncertainties: [
                  "Gemini Vision was unavailable.",
                  "OCR fallback could not extract usable text.",
                  "Manual verification is required.",
                ],

                overallConfidence: 0,
              },
            };
          } else {
            const fallbackResult =
              runFallbackAnalysis({
                ocrText: ocrResult.text,
                ocrConfidence: ocrResult.confidence,
              });

            result = {
              ...fallbackResult,
              source: "LOCAL_FALLBACK",
            };

            console.log(
              `Local fallback completed for ${side}.`
            );
          }
        } catch (fallbackError) {
          console.error(
            "Fallback analysis failed:",
            fallbackError.message
          );

          result = {
            success: true,
            source: "LOCAL_FALLBACK",
            analysisStatus: "NEEDS_VERIFICATION",

            analysis: {
              product: {
                name: "",
                brand: "",
                category: "",
              },

              declarations: {},

              missingDeclarations: [
                "manufacturer",
                "packer",
                "importer",
                "netQuantity",
                "mrp",
                "batchNumber",
                "manufacturingDate",
                "expiryDate",
                "consumerCare",
                "countryOfOrigin",
              ],

              uncertainties: [
                "AI analysis was unavailable.",
                "Local fallback analysis failed.",
                "Manual verification is required.",
              ],

              overallConfidence: 0,
            },
          };
        }
      }

      // Normalize fallback analysis to the same structure
      // expected by the Evidence UI
      if (
        result?.source === "LOCAL_FALLBACK" &&
        result?.analysis
      ) {
        result.pipeline = {
          gemini: {
            analysis: result.analysis,
          },
        };
      }

      panelResults[side] = result;

      // -----------------------------------------
      // STEP 2: Evidence mapping
      // -----------------------------------------

      if (
        result.success &&
        result.analysis &&
        Object.keys(result.analysis).length > 0
      ) {
        const evidenceResult = mapEvidence(
          result.analysis,
          absolutePath
        );

        if (evidenceResult.success) {
          evidence.push(
            ...evidenceResult.evidence.map((item) => ({
              ...item,
              side,
            }))
          );
        }
      }
    }

    // -----------------------------------------
    // STEP 3: Confidence
    // -----------------------------------------

    const confidenceResults = {};

    Object.entries(panelResults).forEach(
      ([side, result]) => {
        if (
          result.success &&
          result.analysis
        ) {
          confidenceResults[side] =
            calculateConfidence(result.analysis);
        }
      }
    );

    // -----------------------------------------
    // STEP 4: Cross-panel consistency
    // -----------------------------------------

    const crossPanelResult =
      analyzeCrossPanel(panelResults);

    // -----------------------------------------
    // STEP 5: Determine AI inspection state
    // -----------------------------------------

    const confidenceScores = Object.values(
      confidenceResults
    ).map((item) => item.score);

    const lowestConfidence =
      confidenceScores.length > 0
        ? Math.min(...confidenceScores)
        : 0;

    let analysisStatus = "COMPLETED";

    // Any fallback result requires verification
    const usedFallback = Object.values(
      panelResults
    ).some(
      (result) =>
        result.source === "LOCAL_FALLBACK"
    );

    if (usedFallback) {
      analysisStatus = "NEEDS_VERIFICATION";
    }

    if (lowestConfidence < 80) {
      analysisStatus = "NEEDS_VERIFICATION";
    }

    if (
      crossPanelResult.status ===
      "CONFLICTS_FOUND"
    ) {
      analysisStatus = "NEEDS_VERIFICATION";
    }

    // -----------------------------------------
    // FINAL RESULT
    // -----------------------------------------

    console.log(
      "\nAI inspection completed."
    );

    console.log(
      `Analysis status: ${analysisStatus}`
    );

    if (usedFallback) {
      console.log(
        "Fallback mode was used for one or more panels."
      );
    }

    return {
      success: true,

      analysisStatus,

      panelsAnalyzed:
        Object.keys(panelResults),

      panels: panelResults,

      confidence: confidenceResults,

      evidence,

      crossPanel: crossPanelResult,

      fallbackUsed: usedFallback,

      summary: {
        lowestConfidence,
        evidenceCount: evidence.length,
        crossPanelStatus:
          crossPanelResult.status,
        fallbackUsed: usedFallback,
      },
    };
  } catch (error) {
    console.error(
      "\nAI orchestrator failed:",
      error.message
    );

    return {
      success: true,

      analysisStatus:
        "NEEDS_VERIFICATION",

      fallbackUsed: true,

      panelsAnalyzed: [],

      panels: {},

      confidence: {},

      evidence: [],

      crossPanel: {
        success: false,
        status: "INSUFFICIENT_PANELS",
        conflicts: [],
      },

      summary: {
        lowestConfidence: 0,
        evidenceCount: 0,
        crossPanelStatus:
          "INSUFFICIENT_PANELS",
        fallbackUsed: true,
      },

      uncertainties: [
        "AI analysis could not be completed.",
        "Manual verification is required.",
      ],
    };
  }
};

module.exports = {
  runInspectionAI,
};