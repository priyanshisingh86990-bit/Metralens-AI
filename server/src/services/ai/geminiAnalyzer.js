const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config({
    path: path.join(__dirname, "../../../.env"),
});

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing from server/.env");
}

const ai = new GoogleGenAI({
    apiKey,
});

const MODEL = "gemini-3.6-flash";

const analyzePackageImage = async ({ imagePath, ocrText = "" }) => {
    try {
        console.log("Starting Gemini 3.6 Flash analysis...");

        if (!fs.existsSync(imagePath)) {
            throw new Error(`Image not found: ${imagePath}`);
        }

        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString("base64");

        const extension = path.extname(imagePath).toLowerCase();

        let mimeType = "image/jpeg";

        if (extension === ".png") {
            mimeType = "image/png";
        }

        if (extension === ".webp") {
            mimeType = "image/webp";
        }

        const prompt = `
You are the vision analysis engine for METRALENS AI,
an AI-assisted Legal Metrology package inspection system.

Analyze the provided packaged commodity image.

Your job is ONLY to identify information that is visibly supported
by the image.

DO NOT make a legal compliance decision.

DO NOT return PASS.

DO NOT return VIOLATION.

DO NOT apply Legal Metrology rules.

DO NOT guess missing information.

If information is not clearly visible, return an empty string
and record it as missing or uncertain.

OCR TEXT FROM TESSERACT:
${ocrText}

Use the OCR text only as supporting evidence.
The image itself is the primary evidence.

Return ONLY valid JSON using exactly this structure:

{
  "product": {
    "name": "",
    "brand": "",
    "category": ""
  },
  "declarations": {
    "manufacturer": {
      "value": "",
      "confidence": 0
    },
    "packer": {
      "value": "",
      "confidence": 0
    },
    "importer": {
      "value": "",
      "confidence": 0
    },
    "netQuantity": {
      "value": "",
      "confidence": 0
    },
    "mrp": {
      "value": "",
      "confidence": 0
    },
    "batchNumber": {
      "value": "",
      "confidence": 0
    },
    "manufacturingDate": {
      "value": "",
      "confidence": 0
    },
    "expiryDate": {
      "value": "",
      "confidence": 0
    },
    "consumerCare": {
      "value": "",
      "confidence": 0
    },
    "countryOfOrigin": {
      "value": "",
      "confidence": 0
    }
  },
  "missingDeclarations": [],
  "uncertainties": [],
  "overallConfidence": 0
}

Confidence must be between 0 and 100.

Do not invent values.
Do not infer values from general product knowledge.
Only report what can be supported by the image and OCR.
`;

        const interaction = await ai.interactions.create({
            model: MODEL,

            input: [
                {
                    type: "user_input",
                    content: [
                        {
                            type: "text",
                            text: prompt,
                        },
                        {
                            type: "image",
                            data: base64Image,
                            mime_type: mimeType,
                        },
                    ],
                },
            ],
        });

        const responseText = interaction.output_text;

        if (!responseText) {
            throw new Error("Gemini returned an empty response.");
        }
        let parsed;

        try {
            let cleanedResponse = responseText.trim();

            // Remove Markdown code fences if Gemini adds them
            cleanedResponse = cleanedResponse
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/\s*```$/i, "")
                .trim();

            parsed = JSON.parse(cleanedResponse);
        } catch (parseError) {
            console.error("Gemini returned invalid JSON:");
            console.error(responseText);

            throw new Error("Gemini response could not be parsed as JSON.");
        }

        return {
            success: true,
            model: MODEL,
            analysis: parsed,
        };
    } catch (error) {
        console.error("Gemini analysis failed:", error.message);

        return {
            success: false,
            error: error.message,
        };
    }
};

module.exports = {
    analyzePackageImage,
};