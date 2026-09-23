import "./EvidencePassport.css";

export default function EvidencePassport({
  inspection,
  analysisResult,
  onBack,
  onContinue,
  onVerify,
}) {
  const ai =
    analysisResult?.aiAnalysis?.result || {};

  const declarations = ai?.panels?.front?.pipeline?.gemini?.analysis
    ?.declarations || {};

  const confidence =
    ai?.summary?.lowestConfidence ??
    ai?.confidence?.front?.score ??
    0;

  const evidenceCount =
    ai?.summary?.evidenceCount ??
    ai?.evidence?.length ??
    0;

  const status =
    analysisResult?.aiAnalysis?.status ||
    ai?.analysisStatus ||
    "NEEDS_VERIFICATION";

  return (
    <div className="passport-page">

      <header className="passport-header">
        <div>
          <div className="passport-logo">M</div>
          <div>
            <h2>METRALENS AI</h2>
            <span>EVIDENCE PASSPORT</span>
          </div>
        </div>

        <div className="passport-id">
          <small>INSPECTION ID</small>
          <strong>{inspection?.inspectionId}</strong>
        </div>
      </header>

      <main className="passport-main">

        <section className="passport-title">
          <span>INSPECTION RECORD</span>
          <h1>Evidence Passport</h1>
          <p>
            Traceable inspection record generated from
            captured package evidence and AI observations.
          </p>
        </section>

        <section className="passport-status">
          <div>
            <small>INSPECTION STATUS</small>
            <h2>{status.replaceAll("_", " ")}</h2>
          </div>

          <div className="passport-metrics">
            <div>
              <strong>{confidence}%</strong>
              <span>AI CONFIDENCE</span>
            </div>

            <div>
              <strong>{evidenceCount}</strong>
              <span>EVIDENCE ITEMS</span>
            </div>
          </div>
        </section>

        <section className="passport-grid">

          <div className="passport-card">
            <span>PRODUCT DETAILS</span>

            <div className="passport-row">
              <label>Product</label>
              <strong>
                {ai?.panels?.front?.pipeline?.gemini?.analysis
                  ?.product?.name ||
                  inspection?.productName ||
                  "—"}
              </strong>
            </div>

            <div className="passport-row">
              <label>Brand</label>
              <strong>
                {ai?.panels?.front?.pipeline?.gemini?.analysis
                  ?.product?.brand ||
                  inspection?.brand ||
                  "—"}
              </strong>
            </div>

            <div className="passport-row">
              <label>Category</label>
              <strong>
                {inspection?.category || "—"}
              </strong>
            </div>

            <div className="passport-row">
              <label>Batch</label>
              <strong>
                {declarations?.batchNumber?.value || "NOT VISIBLE"}
              </strong>
            </div>
          </div>

          <div className="passport-card">
            <span>DECLARATIONS OBSERVED</span>

            {[
              ["Manufacturer", declarations?.manufacturer?.value],
              ["Net Quantity", declarations?.netQuantity?.value],
              ["MRP", declarations?.mrp?.value],
              ["Expiry", declarations?.expiryDate?.value],
              ["Country", declarations?.countryOfOrigin?.value],
            ].map(([label, value]) => (
              <div className="passport-row" key={label}>
                <label>{label}</label>
                <strong>{value || "NOT VISIBLE"}</strong>
              </div>
            ))}
          </div>

        </section>

        <section className="passport-verification">
          <div className="verification-icon">✓</div>

          <div>
            <strong>
              {inspection?.humanVerification?.status === "VERIFIED"
                ? "Inspection verified by inspector"
                : "AI observations preserved"}
            </strong>

            <p>
              {inspection?.humanVerification?.status === "VERIFIED"
                ? `Verified on ${new Date(
                  inspection?.humanVerification?.verifiedAt
                ).toLocaleString()}`
                : "This passport records observations from the inspection evidence. Final verification requires inspector review."}
            </p>
          </div>
          <div className="verification-tag">
            {inspection?.humanVerification?.status === "VERIFIED"
              ? "✓ VERIFIED"
              : "AWAITING VERIFICATION"}
          </div>
          {inspection?.humanVerification?.status !== "VERIFIED" && (
            <button
              className="passport-verify-button"
              onClick={onVerify}
            >
              ✓ Verify Inspection
            </button>
          )}
        </section>

      </main>

      <footer className="passport-footer">
        <button
          className="passport-secondary"
          onClick={onBack}
        >
          ← Evidence
        </button>

        <span>
          METRALENS · SEE. VERIFY. PROVE.
        </span>

        <button
          className="passport-primary"
          onClick={onContinue}
        >
          Inspection History →
        </button>
      </footer>

    </div>
  );
}