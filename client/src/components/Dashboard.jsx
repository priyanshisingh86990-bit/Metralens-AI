function Dashboard({
  user,
  onLogout,
  onNewInspection,
}) {
  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">M</div>
          <div>
            <strong>METRALENS</strong>
            <span>AI INSPECTION</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="active">
            <span>⌂</span>
            Overview
          </button>

          <button>
            <span>＋</span>
            New Inspection
          </button>

          <button>
            <span>◈</span>
            Inspection History
          </button>

          <button>
            <span>▣</span>
            Evidence Passport
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot"></span>
            System Operational
          </div>

          <button className="logout-button" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span className="dashboard-kicker">
              INSPECTOR CONSOLE / OVERVIEW
            </span>

            <h1>Good evening, {user?.name || "Inspector"}.</h1>

            <p>
              Here's your inspection intelligence at a glance.
            </p>
          </div>

          <div className="profile">
            <div className="avatar">
              {(user?.name || "I").charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{user?.name}</strong>
              <span>{user?.inspectorId}</span>
            </div>
          </div>
        </header>

        <section className="dashboard-hero">
          <div>
            <span className="dashboard-kicker">
              READY FOR INSPECTION
            </span>

            <h2>
              Inspect a package.
              <br />
              <span>Verify the evidence.</span>
            </h2>

            <p>
              Capture package images and let METRALENS analyse
              declarations, evidence quality and compliance.
            </p>

            <button
              className="primary-button"
              onClick={onNewInspection}
            >
              + Start New Inspection
            </button>
          </div>

          <div className="dashboard-orb">
            <div className="orb-ring"></div>
            <div className="orb-core">M</div>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span>TOTAL INSPECTIONS</span>
            <strong>0</strong>
            <small>All recorded inspections</small>
          </div>

          <div className="stat-card">
            <span>PASSED</span>
            <strong>0</strong>
            <small>Verified compliant</small>
          </div>

          <div className="stat-card warning">
            <span>POTENTIAL VIOLATIONS</span>
            <strong>0</strong>
            <small>Require attention</small>
          </div>

          <div className="stat-card">
            <span>NEEDS VERIFICATION</span>
            <strong>0</strong>
            <small>Insufficient evidence</small>
          </div>
        </section>

        <section className="dashboard-content-grid">
          <div className="recent-panel">
            <div className="panel-heading">
              <div>
                <span>INSPECTION ACTIVITY</span>
                <h3>Recent inspections</h3>
              </div>

              <button>View all →</button>
            </div>

            <div className="empty-state">
              <div className="empty-icon">◈</div>
              <h4>No inspections yet</h4>
              <p>
                Your completed inspections will appear here with
                their compliance status and evidence trail.
              </p>

              <button className="secondary-button">
                Start first inspection
              </button>
            </div>
          </div>

          <div className="integrity-panel">
            <span>INSPECTION INTEGRITY</span>

            <h3>Evidence-first workflow</h3>

            <div className="integrity-list">
              <div>
                <span>01</span>
                <p>Image quality gate</p>
                <strong>READY</strong>
              </div>

              <div>
                <span>02</span>
                <p>AI + OCR analysis</p>
                <strong>READY</strong>
              </div>

              <div>
                <span>03</span>
                <p>Rule verification</p>
                <strong>READY</strong>
              </div>

              <div>
                <span>04</span>
                <p>Evidence passport</p>
                <strong>READY</strong>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;