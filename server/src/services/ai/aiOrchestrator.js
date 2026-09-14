const path = require("path");

const { analyzeImage } = require("./aiAnalyzer");
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

      const result = await analyzeImage(absolutePath);

      panelResults[side] = result;

      // -----------------------------------------
      // STEP 2: Evidence mapping
      // -----------------------------------------

      if (result.success) {
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

    Object.entries(panelResults).forEach(([side, result]) => {
      if (result.success) {
        confidenceResults[side] =
          calculateConfidence(result.analysis);
      }
    });

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

    if (lowestConfidence < 80) {
      analysisStatus = "NEEDS_VERIFICATION";
    }

    if (
      crossPanelResult.status === "CONFLICTS_FOUND"
    ) {
      analysisStatus = "NEEDS_VERIFICATION";
    }

    // -----------------------------------------
    // FINAL RESULT
    // -----------------------------------------

    return {
      success: true,

      analysisStatus,

      panelsAnalyzed: Object.keys(panelResults),

      panels: panelResults,

      confidence: confidenceResults,

      evidence,

      crossPanel: crossPanelResult,

      summary: {
        lowestConfidence,
        evidenceCount: evidence.length,
        crossPanelStatus: crossPanelResult.status,
      },
    };
  } catch (error) {
    console.error(
      "\nAI orchestrator failed:",
      error.message
    );

    return {
      success: false,
      analysisStatus: "NEEDS_VERIFICATION",
      error: error.message,
    };
  }
};

module.exports = {
  runInspectionAI,
};