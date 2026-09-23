const extractMatch = (text, patterns) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return "";
};

const extractNetQuantity = (text) => {
  return extractMatch(text, [
    /(?:net\s*(?:qty|quantity|weight)|net\s*wt\.?)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?\s*(?:g|gm|kg|ml|l|litre|liter|oz|pcs?|pieces?))/i,

    /\b([0-9]+(?:\.[0-9]+)?\s*(?:g|gm|kg|ml|l|oz))\b/i,
  ]);
};

const extractMRP = (text) => {
  return extractMatch(text, [
    /(?:mrp|m\.r\.p\.?)\s*(?:rs\.?|₹)?\s*[:\-]?\s*(?:rs\.?|₹)?\s*([0-9]+(?:\.[0-9]+)?)/i,

    /(?:maximum\s*retail\s*price)\s*(?:rs\.?|₹)?\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)/i,
  ]);
};

const extractBatchNumber = (text) => {
  return extractMatch(text, [
    /(?:batch\s*(?:no|number)?|lot\s*(?:no|number)?)\s*[:\-]?\s*([A-Z0-9][A-Z0-9\/\-_]{2,})/i,
  ]);
};

const extractManufacturingDate = (text) => {
  return extractMatch(text, [
    /(?:mfg|mfd|manufacturing\s*date|manufactured\s*on)\s*[:\-]?\s*([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})/i,

    /(?:mfg|mfd)\s*[:\-]?\s*([0-9]{1,2}[\/\-][0-9]{2,4})/i,
  ]);
};

const extractExpiryDate = (text) => {
  return extractMatch(text, [
    /(?:exp|expiry|use\s*before|best\s*before)\s*[:\-]?\s*([^\n]+)/i,
  ]);
};

const extractCountry = (text) => {
  return extractMatch(text, [
    /(?:country\s*of\s*origin|made\s*in)\s*[:\-]?\s*([A-Za-z ]{2,40})/i,
  ]);
};

const extractManufacturer = (text) => {
  return extractMatch(text, [
    /(?:manufactured\s*by|manufacturer)\s*[:\-]?\s*([^\n]+)/i,

    /(?:mfg\.?\s*by)\s*[:\-]?\s*([^\n]+)/i,
  ]);
};

const extractPacker = (text) => {
  return extractMatch(text, [
    /(?:packed\s*by|packer)\s*[:\-]?\s*([^\n]+)/i,
  ]);
};

const extractImporter = (text) => {
  return extractMatch(text, [
    /(?:imported\s*by|importer)\s*[:\-]?\s*([^\n]+)/i,
  ]);
};

const createDeclaration = (value) => {
  if (!value) {
    return {
      value: "",
      confidence: 0,
    };
  }

  return {
    value,
    confidence: 70,
  };
};

const runFallbackAnalysis = ({
  ocrText = "",
  ocrConfidence = 0,
}) => {
  const text = String(ocrText || "").trim();
  console.log("\n========== FALLBACK OCR TEXT ==========");
  console.log(text);
  console.log("========================================\n");

  if (!text) {
    return {
      success: true,
      source: "LOCAL_FALLBACK",
      analysisStatus: "NEEDS_VERIFICATION",

      analysis: {
        product: {
          name: "",
          brand: "",
          category: "",
        },

        declarations: {
          manufacturer: createDeclaration(""),
          packer: createDeclaration(""),
          importer: createDeclaration(""),
          netQuantity: createDeclaration(""),
          mrp: createDeclaration(""),
          batchNumber: createDeclaration(""),
          manufacturingDate: createDeclaration(""),
          expiryDate: createDeclaration(""),
          consumerCare: createDeclaration(""),
          countryOfOrigin: createDeclaration(""),
        },

        missingDeclarations: [
          "manufacturer",
          "packer",
          "importer",
          "netQuantity",
          "mrp",
          "batchNumber",
          "manufacturingDate",
          "expiryDate",
          "consumerCare",
          "countryOfOrigin",
        ],

        uncertainties: [
          "OCR returned no usable text.",
          "AI vision analysis was unavailable.",
        ],

        overallConfidence: 0,
      },
    };
  }

  const manufacturer = extractManufacturer(text);
  const packer = extractPacker(text);
  const importer = extractImporter(text);
  const netQuantity = extractNetQuantity(text);
  const mrp = extractMRP(text);
  const batchNumber = extractBatchNumber(text);
  const manufacturingDate = extractManufacturingDate(text);
  const expiryDate = extractExpiryDate(text);
  const countryOfOrigin = extractCountry(text);

  const declarations = {
    manufacturer: createDeclaration(manufacturer),
    packer: createDeclaration(packer),
    importer: createDeclaration(importer),
    netQuantity: createDeclaration(netQuantity),
    mrp: createDeclaration(mrp),
    batchNumber: createDeclaration(batchNumber),
    manufacturingDate: createDeclaration(manufacturingDate),
    expiryDate: createDeclaration(expiryDate),
    consumerCare: createDeclaration(""),
    countryOfOrigin: createDeclaration(countryOfOrigin),
  };

  const missingDeclarations = Object.entries(declarations)
    .filter(([, declaration]) => !declaration.value)
    .map(([field]) => field);

  const foundCount =
    Object.keys(declarations).length -
    missingDeclarations.length;

  const uncertainties = [
    "Gemini Vision analysis was unavailable; declarations were extracted using local OCR fallback.",
  ];

  if (ocrConfidence < 70) {
    uncertainties.push(
      "OCR confidence is low; extracted declarations require manual verification."
    );
  }

  const extractionScore =
    (foundCount / Object.keys(declarations).length) * 100;

  const overallConfidence = Math.round(
    extractionScore * 0.6 +
    Math.min(Number(ocrConfidence) || 0, 100) * 0.4
  );

  return {
    success: true,
    source: "LOCAL_FALLBACK",
    analysisStatus: "NEEDS_VERIFICATION",

    analysis: {
      product: {
        name: "",
        brand: "",
        category: "",
      },

      declarations,

      missingDeclarations,

      uncertainties,

      overallConfidence,
    },
  };
};

module.exports = {
  runFallbackAnalysis,
};