const calculateConfidence = (analysis) => {
    if (!analysis) {
        return {
            score: 0,
            status: "NEEDS_VERIFICATION",
            reasons: ["AI analysis is unavailable."],
        };
    }

    const reasons = [];

    const overallConfidence = Number(analysis.overallConfidence || 0);

    const declarations = analysis.declarations || {};

    const declarationValues = Object.values(declarations);

    const confidenceValues = declarationValues
        .map((item) => Number(item?.confidence || 0))
        .filter((value) => value > 0);

    const averageDeclarationConfidence =
        confidenceValues.length > 0
            ? confidenceValues.reduce((sum, value) => sum + value, 0) /
            confidenceValues.length
            : 0;

    const missingCount = Array.isArray(analysis.missingDeclarations)
        ? analysis.missingDeclarations.length
        : 0;

    const uncertaintyCount = Array.isArray(analysis.uncertainties)
        ? analysis.uncertainties.length
        : 0;

    // Combine Gemini overall confidence and field-level confidence.
    let score =
        overallConfidence * 0.6 +
        averageDeclarationConfidence * 0.4;

    // Reduce confidence when information is missing or uncertain.
    score -= missingCount * 3;
    score -= uncertaintyCount * 2;

    score = Math.max(0, Math.min(100, Math.round(score)));
    let status;
    if (score >= 80) {
        status = "RELIABLE";
    } else {
        status = "NEEDS_VERIFICATION";
    }

    if (missingCount > 0) {
        reasons.push(`${missingCount} declaration(s) are missing or not visible.`);
    }

    if (uncertaintyCount > 0) {
        reasons.push(`${uncertaintyCount} uncertainty issue(s) detected.`);
    }

    if (overallConfidence < 70) {
        reasons.push("Overall AI confidence is below the recommended threshold.");
    }

    return {
        score,
        status,
        reasons,
        metrics: {
            overallConfidence,
            averageDeclarationConfidence: Math.round(
                averageDeclarationConfidence
            ),
            missingDeclarations: missingCount,
            uncertainties: uncertaintyCount,
        },
    };
};

module.exports = {
    calculateConfidence,
};