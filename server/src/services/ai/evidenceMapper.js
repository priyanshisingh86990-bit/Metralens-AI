const mapEvidence = (analysis, imagePath) => {
  if (!analysis) {
    return {
      success: false,
      evidence: [],
    };
  }

  const evidence = [];

  const declarations = analysis.declarations || {};

  Object.entries(declarations).forEach(([field, data]) => {
    if (!data || !data.value) {
      return;
    }

    evidence.push({
      field,
      value: data.value,
      confidence: Number(data.confidence || 0),
      source: "IMAGE",
      imagePath,
      evidenceType: "DECLARATION",
    });
  });

  return {
    success: true,
    evidence,
  };
};

module.exports = {
  mapEvidence,
};