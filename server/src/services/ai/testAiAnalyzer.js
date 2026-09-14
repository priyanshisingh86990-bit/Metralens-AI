const path = require("path");
const { analyzeImage } = require("./aiAnalyzer");

const imagePath = process.argv[2];

if (!imagePath) {
  console.error("Please provide an image path.");
  console.error(
    "Example: node src/services/ai/testAiAnalyzer.js test-images/front.jpg"
  );
  process.exit(1);
}

const runTest = async () => {
  const absoluteImagePath = path.resolve(process.cwd(), imagePath);

  console.log("Image:", absoluteImagePath);

  const result = await analyzeImage(absoluteImagePath);

  console.log("\n\n========== FINAL AI PIPELINE RESULT ==========\n");

  console.log(JSON.stringify(result, null, 2));

  console.log("\n==============================================\n");
};

runTest();