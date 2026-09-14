import "./EvidenceView.css";

export default function EvidenceView({
  inspection,
  analysisResult,
  onBack,
  onContinue,
}) {
  const evidence =
    analysisResult?.aiAnalysis?.result?.evidence || [];

  const frontImage =
    inspection?.evidence?.front?.url || "";

  const imageUrl = frontImage
    ? `http://localhost:5000${frontImage}`
    : "";

  return (
    <div className="evidence-view-page">

      <header className="evidence-header">
        <div className="evidence-brand">
          <div className="evidence-logo">M</div>
          <div>
            <h2>METRALENS</h2>
            <span>EVIDENCE CONSOLE</span>
          </div>
        </div>

        <div className="evidence-id">
          <span>INSPECTION</span>
          <strong>
            {inspection?.inspectionId || "ML-PENDING"}
          </strong>
        </div>
      </header>

      <main className="evidence-main">

        <div className="evidence-title">
          <span>EVIDENCE REVIEW</span>
          <h1>Verify what the AI observed.</h1>
          <p>
            Review the original package image and the
            declarations extracted from it.
          </p>
        </div>

        <div className="evidence-layout">

          {/* IMAGE */}
          <section className="evidence-image-card">
            <div className="evidence-card-header">
              <div>
                <span>ORIGINAL CAPTURE</span>
                <h3>Front Panel</h3>
              </div>

              <div className="capture-status">
                ● VERIFIED SOURCE
              </div>
            </div>

            <div className="evidence-image-container">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Captured package"
                />
              ) : (
                <div className="no-image">
                  No image available
                </div>
              )}
            </div>

            <div className="image-meta">
              <span>
                Original inspection image
              </span>

              <span>
                {inspection?.evidence?.front?.originalName ||
                  "capture.jpg"}
              </span>
            </div>
          </section>

          {/* EVIDENCE */}
          <section className="evidence-list-card">

            <div className="evidence-card-header">
              <div>
                <span>AI OBSERVATIONS</span>
                <h3>
                  Extracted declarations
                </h3>
              </div>

              <div className="evidence-count">
                {evidence.length}
              </div>
            </div>

            <div className="evidence-items">

              {evidence.length > 0 ? (
                evidence.map((item, index) => (
                  <div
                    className="evidence-item"
                    key={`${item.field}-${index}`}
                  >
                    <div className="evidence-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="evidence-detail">
                      <span>
                        {item.field}
                      </span>

                      <strong>
                        {item.value}
                      </strong>

                      <small>
                        SOURCE: {item.source} ·{" "}
                        CONFIDENCE: {item.confidence}%
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-evidence">
                  No evidence items available.
                </div>
              )}

            </div>

          </section>

        </div>

        <div className="evidence-warning">
          <div>◈</div>

          <p>
            These are AI-generated observations linked to
            the original inspection image. They are not
            themselves a final legal determination.
          </p>
        </div>

      </main>

      <footer className="evidence-footer">

        <button
          className="secondary-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <span>
          EVIDENCE PRESERVED FOR INSPECTION REVIEW
        </span>

        <button
          className="primary-button"
          onClick={onContinue}
        >
          Evidence Passport →
        </button>

      </footer>

    </div>
  );
}