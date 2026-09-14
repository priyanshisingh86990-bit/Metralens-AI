const Tesseract = require("tesseract.js");

const extractTextFromImage = async (
  imagePath
) => {
  try {
    console.log(
      "Starting OCR:",
      imagePath
    );

    const result =
      await Tesseract.recognize(
        imagePath,
        "eng",
        {
          logger: (info) => {
            if (
              info.status ===
              "recognizing text"
            ) {
              const progress =
                Math.round(
                  info.progress * 100
                );

              console.log(
                `OCR Progress: ${progress}%`
              );
            }
          },
        }
      );

    const text =
      result.data.text?.trim() || "";

    const confidence =
      result.data.confidence || 0;

    return {
      success: true,
      text,
      confidence,
    };
  } catch (error) {
    console.error(
      "OCR extraction failed:",
      error.message
    );

    return {
      success: false,
      text: "",
      confidence: 0,
      error: error.message,
    };
  }
};

module.exports = {
  extractTextFromImage,
};