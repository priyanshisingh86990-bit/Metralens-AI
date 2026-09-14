const path = require("path");

const { analyzeImage } = require("./aiAnalyzer");
const { mapEvidence } = require("./evidenceMapper");

const imagePath = process.argv[2];

if (!imagePath) {
  console.error(
    "Example: node src/services/ai/testEvidenceMapper.js test-images/front.jpg"
  );
  process.exit(1);
}

const runTest = async () => {
  const absoluteImagePath = path.resolve(process.cwd(), imagePath);

  console.log("\nRunning AI pipeline...\n");

  const aiResult = await analyzeImage(absoluteImagePath);

  if (!aiResult.success) {
    console.error("AI pipeline failed:", aiResult.error);
    process.exit(1);
  }

  const evidenceResult = mapEvidence(
    aiResult.analysis,
    absoluteImagePath
  );

  console.log("\n========== EVIDENCE RESULT ==========\n");

  console.log(JSON.stringify(evidenceResult, null, 2));

  console.log("\n=====================================\n");
};

runTest();