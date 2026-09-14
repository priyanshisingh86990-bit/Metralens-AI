const path = require("path");

const {
  analyzePackageImage,
} = require("./geminiAnalyzer");

const imagePath =
  process.argv[2];

const ocrText =
  process.argv[3] || "";

if (!imagePath) {
  console.error(
    "Please provide an image path."
  );

  process.exit(1);
}


const runTest = async () => {
  const absoluteImagePath =
    path.resolve(
      process.cwd(),
      imagePath
    );

  console.log(
    "\nImage:",
    absoluteImagePath
  );

  const result =
    await analyzePackageImage({
      imagePath:
        absoluteImagePath,

      ocrText,
    });


  console.log(
    "\n========== GEMINI RESULT ==========\n"
  );

  console.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );

  console.log(
    "\n===================================\n"
  );
};


runTest();