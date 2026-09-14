const {
  extractTextFromImage,
} = require("./ocrService");

const imagePath =
  process.argv[2];

if (!imagePath) {
  console.error(
    "Please provide an image path."
  );

  process.exit(1);
}

const runTest = async () => {
  const result =
    await extractTextFromImage(
      imagePath
    );

  console.log(
    "\n========== OCR RESULT ==========\n"
  );

  console.log(result);

  console.log(
    "\n================================\n"
  );
};

runTest();