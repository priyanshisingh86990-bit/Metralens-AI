const {
  runFallbackAnalysis,
} = require("./fallbackAnalyzer");

const sampleOCR = `
FAIRDEW FAIRNESS CREAM FOR WOMEN

Manufactured by:
Indo Herbal Products, Haridwar, Uttarakhand

Net Quantity: 50 gm

Mfg: 05/2025

Best Before: 24 months from Mfg date

Made in India
`;

const result = runFallbackAnalysis({
  ocrText: sampleOCR,
  ocrConfidence: 79,
});

console.log(
  JSON.stringify(result, null, 2)
);