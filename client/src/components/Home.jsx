function Home({ onGetStarted }) {
  return (
    <div className="home-page">
      <nav className="navbar">
        <div className="brand">
          <div className="brand-mark">M</div>

          <div>
            <div className="brand-name">METRALENS AI</div>
            <div className="brand-subtitle">
              Legal Metrology Intelligence
            </div>
          </div>
        </div>

        <div className="nav-links">
          <a href="#capabilities">Capabilities</a>
          <a href="#workflow">How it works</a>
          <a href="#trust">Why MetraLens</a>
        </div>

        <button className="nav-button" onClick={onGetStarted}>
          Inspector Login
        </button>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="status-dot"></span>
              AI-ASSISTED FIELD INSPECTION
            </div>

            <h1>
              See.
              <br />
              <span>Verify.</span>
              <br />
              Prove.
            </h1>

            <p className="hero-description">
              METRALENS AI transforms packaged commodity inspections
              into structured, explainable and traceable compliance
              records using computer vision, OCR and rule-based
              verification.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={onGetStarted}
              >
                Start Inspection
                <span>→</span>
              </button>

              <button className="secondary-button">
                Explore Platform
              </button>
            </div>

            <div className="hero-trust">
              <div>
                <strong>AI + OCR</strong>
                <span>Multimodal analysis</span>
              </div>

              <div>
                <strong>Rule-Based</strong>
                <span>Explainable decisions</span>
              </div>

              <div>
                <strong>Evidence Ready</strong>
                <span>Traceable inspection record</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="scanner-card">
              <div className="scanner-header">
                <span>LIVE INSPECTION</span>
                <span className="live-badge">● ACTIVE</span>
              </div>

              <div className="package-preview">
                <div className="package-box">
                  <div className="package-label">
                    <small>PACKAGED COMMODITY</small>
                    <strong>PRODUCT</strong>
                    <span>NET QTY • MRP • DECLARATIONS</span>
                  </div>

                  <div className="scan-line"></div>
                </div>

                <div className="scan-corner top-left"></div>
                <div className="scan-corner top-right"></div>
                <div className="scan-corner bottom-left"></div>
                <div className="scan-corner bottom-right"></div>
              </div>

              <div className="analysis-panel">
                <div>
                  <span>Declaration detection</span>
                  <strong>98.4%</strong>
                </div>

                <div>
                  <span>Evidence coverage</span>
                  <strong>94.7%</strong>
                </div>

                <div>
                  <span>Verification status</span>
                  <strong className="verification">
                    READY
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="capabilities" id="capabilities">
          <div className="section-heading">
            <span>01 / CAPABILITIES</span>
            <h2>From package scan to defensible inspection.</h2>
          </div>

          <div className="feature-grid">
            <article className="feature-card featured">
              <div className="feature-number">01</div>
              <h3>Package Integrity Matrix</h3>
              <p>
                Analyze multiple sides of the same package as one
                inspection record and detect conflicting declarations
                across panels.
              </p>
              <div className="feature-tag">
                MULTI-SIDE INTELLIGENCE
              </div>
            </article>

            <article className="feature-card">
              <div className="feature-number">02</div>
              <h3>No-Guess Verification</h3>
              <p>
                When evidence is insufficient, the system does not
                invent a compliance verdict. It requests verification
                or recapture.
              </p>
              <div className="feature-tag">
                EVIDENCE FIRST
              </div>
            </article>

            <article className="feature-card">
              <div className="feature-number">03</div>
              <h3>Evidence Passport</h3>
              <p>
                Maintain images, declarations, rule results, evidence
                regions, timestamps and inspection metadata in one
                traceable record.
              </p>
              <div className="feature-tag">
                TRACEABLE RECORDS
              </div>
            </article>
          </div>
        </section>

        <section className="workflow" id="workflow">
          <div className="section-heading">
            <span>02 / WORKFLOW</span>
            <h2>One inspection. One evidence trail.</h2>
          </div>

          <div className="workflow-line">
            <div>
              <span>01</span>
              <strong>Capture</strong>
              <p>Photograph the package.</p>
            </div>

            <div>
              <span>02</span>
              <strong>Understand</strong>
              <p>AI + OCR extract declarations.</p>
            </div>

            <div>
              <span>03</span>
              <strong>Verify</strong>
              <p>Rules evaluate compliance.</p>
            </div>

            <div>
              <span>04</span>
              <strong>Prove</strong>
              <p>Generate the evidence record.</p>
            </div>
          </div>
        </section>

        <section className="final-cta" id="trust">
          <div>
            <span>METRALENS AI</span>
            <h2>
              Turn every package scan into an
              <br />
              explainable inspection.
            </h2>
          </div>

          <button className="primary-button" onClick={onGetStarted}>
            Enter Inspection Console →
          </button>
        </section>
      </main>

      <footer>
        <span>© 2026 METRALENS AI</span>
        <span>See. Verify. Prove.</span>
      </footer>
    </div>
  );
}

export default Home;