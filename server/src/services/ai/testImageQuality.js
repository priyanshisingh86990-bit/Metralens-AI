const {
  analyzeImageQuality,
} = require("./imageQuality");

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
    await analyzeImageQuality(
      imagePath
    );

  console.log(
    "\n======= IMAGE QUALITY RESULT =======\n"
  );

  console.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );

  console.log(
    "\n====================================\n"
  );
};

runTest();