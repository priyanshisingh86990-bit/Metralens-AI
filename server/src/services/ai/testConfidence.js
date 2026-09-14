const { analyzeImage } = require("./aiAnalyzer");
const { calculateConfidence } = require("./confidence");

const imagePath = process.argv[2];

if (!imagePath) {
  console.error(
    "Example: node src/services/ai/testConfidence.js test-images/front.jpg"
  );
  process.exit(1);
}

const runTest = async () => {
  console.log("\nRunning complete AI pipeline...\n");

  const aiResult = await analyzeImage(imagePath);

  if (!aiResult.success) {
    console.error("AI pipeline failed:", aiResult.error);
    process.exit(1);
  }

  const confidenceResult = calculateConfidence(aiResult.analysis);

  console.log("\n========== CONFIDENCE RESULT ==========\n");

  console.log(JSON.stringify(confidenceResult, null, 2));

  console.log("\n=======================================\n");
};

runTest();