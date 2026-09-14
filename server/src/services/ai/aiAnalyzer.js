const path = require("path");

const { extractTextFromImage } = require("./ocrService");
const { analyzePackageImage } = require("./geminiAnalyzer");

const analyzeImage = async (imagePath) => {
  try {
    const absoluteImagePath = path.resolve(imagePath);

    console.log("\n=================================");
    console.log("METRALENS AI ANALYSIS PIPELINE");
    console.log("=================================\n");

    // STEP 1: OCR
    console.log("STEP 1: Running Tesseract OCR...");

    const ocrResult = await extractTextFromImage(absoluteImagePath);

    if (!ocrResult.success) {
      console.warn("OCR failed. Continuing with Gemini...");
    }

    console.log("\nOCR Confidence:", ocrResult.confidence);
    console.log("\nOCR Text:\n", ocrResult.text);

    // STEP 2: Gemini Vision + OCR
    console.log("\nSTEP 2: Running Gemini Vision...");

    const geminiResult = await analyzePackageImage({
      imagePath: absoluteImagePath,
      ocrText: ocrResult.text || "",
    });

    if (!geminiResult.success) {
      return {
        success: false,
        stage: "GEMINI",
        ocr: ocrResult,
        error: geminiResult.error,
      };
    }

    // STEP 3: Combined result
    console.log("\nSTEP 3: Combining OCR + Gemini results...");

    return {
      success: true,

      pipeline: {
        ocr: {
          success: ocrResult.success,
          confidence: ocrResult.confidence,
          text: ocrResult.text,
        },

        gemini: {
          success: geminiResult.success,
          model: geminiResult.model,
          analysis: geminiResult.analysis,
        },
      },

      // Convenient access for backend integration
      analysis: geminiResult.analysis,
    };
  } catch (error) {
    console.error("\nAI pipeline failed:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  analyzeImage,
};