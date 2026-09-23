import "./ComplianceResult.css";

export default function ComplianceResult({
  inspection,
  analysisResult,
  onBack,
  onContinue,
}) {
  const aiStatus =
    analysisResult?.aiAnalysis?.status ||
    analysisResult?.analysisStatus ||
    "NEEDS_VERIFICATION";

  const isVerification = aiStatus === "NEEDS_VERIFICATION";

  const aiResult =
    analysisResult?.aiAnalysis?.result || {};
    console.log("COMPLIANCE AI RESULT:", aiResult);

  // ---------------------------------------
  // EVIDENCE COVERAGE
  // ---------------------------------------
  const evidence = aiResult?.evidence;

  const evidenceCount = Array.isArray(evidence)
    ? evidence.length
    : evidence && typeof evidence === "object"
      ? Object.keys(evidence).length
      : 0;

  // ---------------------------------------
  // AI CONFIDENCE
  // ---------------------------------------
  const confidenceValues = Object.values(
    aiResult?.confidence || {}
  )
    .map((item) => Number(item?.score))
    .filter((value) => Number.isFinite(value));

  const aiConfidence =
    confidenceValues.length > 0
      ? Math.round(Math.min(...confidenceValues))
      : 0;

  return (
    <div className="compliance-page">

      {/* HEADER */}
      <header className="compliance-header">

        <div className="compliance-brand">
          <div className="compliance-logo">M</div>

          <div>
            <h2>METRALENS</h2>
            <span>AI INSPECTION CONSOLE</span>
          </div>
        </div>

        <div className="compliance-id">
          <span>INSPECTION</span>
          <strong>
            {inspection?.inspectionId || "ML-PENDING"}
          </strong>
        </div>

      </header>

      {/* MAIN */}
      <main className="compliance-main">

        <div className="result-container">

          {/* TOP LABEL */}
          <div className="result-eyebrow">
            INSPECTION RESULT
          </div>

          <h1>
            Compliance evaluation
          </h1>

          <p className="result-subtitle">
            Review the extracted declarations, evidence and
            rule evaluation before taking enforcement action.
          </p>

          {/* STATUS */}
          <section className="status-card">

            <div className="status-icon">
              !
            </div>

            <div className="status-content">

              <span className="status-label">
                CURRENT STATUS
              </span>

              <h2>
                {isVerification
                  ? "Needs Verification"
                  : "Analysis Complete"}
              </h2>

              <p>
                {isVerification
                  ? "The available package evidence is insufficient for a confident final determination."
                  : "AI analysis has completed successfully. Final compliance determination is handled by the rule engine."}
              </p>

            </div>

            <div className="status-badge">
              {isVerification
                ? "VERIFY"
                : "READY"}
            </div>

          </section>

          {/* PRODUCT */}
          <section className="result-grid">

            <div className="info-card">

              <div className="card-label">
                PRODUCT
              </div>

              <h3>
                {analysisResult
                  ?.aiAnalysis
                  ?.result
                  ?.panels
                  ?.front
                  ?.pipeline
                  ?.gemini
                  ?.analysis
                  ?.product
                  ?.name ||
                  inspection?.productName ||
                  "Package under inspection"}
              </h3>

              <p>
                {analysisResult
                  ?.aiAnalysis
                  ?.result
                  ?.panels
                  ?.front
                  ?.pipeline
                  ?.gemini
                  ?.analysis
                  ?.product
                  ?.brand ||
                  inspection?.brand ||
                  "Brand not available"}
              </p>

            </div>

            <div className="info-card">

              <div className="card-label">
                EVIDENCE COVERAGE
              </div>

              <div className="big-number">
                {evidenceCount}
              </div>

              <p>
                declaration evidence items detected
              </p>

            </div>

            <div className="info-card">

              <div className="card-label">
                AI CONFIDENCE
              </div>

              <div className="big-number lime">
                {aiConfidence}%
              </div>

              <p>
                lowest panel confidence
              </p>

            </div>

          </section>

          {/* RULE STATUS */}
          <section className="rule-card">

            <div className="rule-header">

              <div>
                <span className="card-label">
                  DETERMINISTIC RULE ENGINE
                </span>

                <h3>
                  Compliance rules
                </h3>
              </div>

              <span className="pending-badge">
                PENDING
              </span>

            </div>

            <div className="rule-row">
              <span>Declaration presence</span>
              <strong>Pending evaluation</strong>
            </div>

            <div className="rule-row">
              <span>Net quantity</span>
              <strong>Pending evaluation</strong>
            </div>

            <div className="rule-row">
              <span>MRP declaration</span>
              <strong>Pending evaluation</strong>
            </div>

            <div className="rule-row">
              <span>Manufacturer / packer details</span>
              <strong>Pending evaluation</strong>
            </div>

            <div className="rule-row">
              <span>Country of origin</span>
              <strong>Pending evaluation</strong>
            </div>

          </section>

          {/* NOTICE */}
          <div className="verification-notice">

            <div className="notice-symbol">
              ◈
            </div>

            <div>
              <strong>
                Evidence-first inspection
              </strong>

              <p>
                AI observations are advisory. Final legal
                compliance status is determined only after
                applying the configured Legal Metrology rules.
              </p>
            </div>

          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="compliance-footer">

        <button
          className="secondary-button"
          onClick={onBack}
        >
          ← Back to Analysis
        </button>

        <span>
          METRALENS AI · See. Verify. Prove.
        </span>

        <button
          className="primary-button"
          onClick={onContinue}
        >
          View Evidence →
        </button>

      </footer>

    </div>
  );
}