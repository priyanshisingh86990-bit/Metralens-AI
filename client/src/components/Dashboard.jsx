import { useEffect, useState } from "react";

import { getInspections } from "../services/api";

function Dashboard({
  user,
  onLogout,
  onNewInspection,
  onViewHistory,
}) {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInspections = async () => {
      try {
        const data = await getInspections(user.id);

        setInspections(data.inspections || []);
      } catch (error) {
        console.error(
          "Failed to load inspections:",
          error.message
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadInspections();
    }
  }, [user?.id]);

  const totalInspections = inspections.length;

  const passedInspections = inspections.filter(
    (inspection) =>
      inspection.status === "PASSED"
  ).length;

  const potentialViolations = inspections.filter(
    (inspection) =>
      inspection.status ===
      "POTENTIAL_VIOLATION"
  ).length;

  const needsVerification = inspections.filter(
    (inspection) =>
      inspection.status ===
      "NEEDS_VERIFICATION"
  ).length;

  const recentInspections =
    inspections.slice(0, 5);

  const getStatusLabel = (status) => {
    switch (status) {
      case "PASSED":
        return "PASSED";

      case "POTENTIAL_VIOLATION":
        return "POTENTIAL VIOLATION";

      case "NEEDS_VERIFICATION":
        return "NEEDS VERIFICATION";

      case "CAPTURE_PENDING":
        return "CAPTURE PENDING";

      case "ANALYSIS_PENDING":
        return "ANALYSIS PENDING";

      case "COMPLETED":
        return "COMPLETED";

      case "DRAFT":
        return "DRAFT";

      default:
        return status || "UNKNOWN";
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

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

          <button onClick={onNewInspection}>
            <span>＋</span>
            New Inspection
          </button>

          <button onClick={onViewHistory}>
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

          <button
            className="logout-button"
            onClick={onLogout}
          >
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

            <h1>
              Good evening,{" "}
              {user?.name || "Inspector"}.
            </h1>

            <p>
              Here's your inspection intelligence
              at a glance.
            </p>
          </div>

          <div className="profile">
            <div className="avatar">
              {(user?.name || "I")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>{user?.name}</strong>
              <span>
                {user?.inspectorId}
              </span>
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
              <span>
                Verify the evidence.
              </span>
            </h2>

            <p>
              Capture package images and let
              METRALENS analyse declarations,
              evidence quality and compliance.
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
            <span>
              TOTAL INSPECTIONS
            </span>

            <strong>
              {loading
                ? "—"
                : totalInspections}
            </strong>

            <small>
              All recorded inspections
            </small>
          </div>

          <div className="stat-card">
            <span>PASSED</span>

            <strong>
              {loading
                ? "—"
                : passedInspections}
            </strong>

            <small>
              Verified compliant
            </small>
          </div>

          <div className="stat-card warning">
            <span>
              POTENTIAL VIOLATIONS
            </span>

            <strong>
              {loading
                ? "—"
                : potentialViolations}
            </strong>

            <small>
              Require attention
            </small>
          </div>

          <div className="stat-card">
            <span>
              NEEDS VERIFICATION
            </span>

            <strong>
              {loading
                ? "—"
                : needsVerification}
            </strong>

            <small>
              Insufficient evidence
            </small>
          </div>
        </section>

        <section className="dashboard-content-grid">
          <div className="recent-panel">
            <div className="panel-heading">
              <div>
                <span>
                  INSPECTION ACTIVITY
                </span>

                <h3>
                  Recent inspections
                </h3>
              </div>

              <button onClick={onViewHistory}>
                View all →
              </button>
            </div>

            {loading ? (
              <div className="empty-state">
                <div className="empty-icon">
                  ◈
                </div>

                <h4>
                  Loading inspections...
                </h4>

                <p>
                  Fetching your inspection
                  records.
                </p>
              </div>
            ) : recentInspections.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  ◈
                </div>

                <h4>
                  No inspections yet
                </h4>

                <p>
                  Your inspections will
                  appear here with their
                  compliance status and
                  evidence trail.
                </p>

                <button
                  className="secondary-button"
                  onClick={onNewInspection}
                >
                  Start first inspection
                </button>
              </div>
            ) : (
              <div className="inspection-list">
                {recentInspections.map(
                  (inspection) => (
                    <div
                      className="inspection-row"
                      key={
                        inspection._id ||
                        inspection.inspectionId
                      }
                    >
                      <div className="inspection-main">
                        <strong>
                          {
                            inspection.inspectionId
                          }
                        </strong>

                        <span>
                          {
                            inspection.productName
                          }
                        </span>
                      </div>

                      <div className="inspection-meta">
                        <span>
                          {inspection.category}
                        </span>

                        <span>
                          {formatDate(
                            inspection.createdAt
                          )}
                        </span>
                      </div>

                      <div className="inspection-status">
                        {
                          getStatusLabel(
                            inspection.status
                          )
                        }
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div className="integrity-panel">
            <span>
              INSPECTION INTEGRITY
            </span>

            <h3>
              Evidence-first workflow
            </h3>

            <div className="integrity-list">
              <div>
                <span>01</span>
                <p>
                  Image quality gate
                </p>
                <strong>NEXT</strong>
              </div>

              <div>
                <span>02</span>
                <p>
                  AI + OCR analysis
                </p>
                <strong>UPCOMING</strong>
              </div>

              <div>
                <span>03</span>
                <p>
                  Rule verification
                </p>
                <strong>UPCOMING</strong>
              </div>

              <div>
                <span>04</span>
                <p>
                  Evidence passport
                </p>
                <strong>UPCOMING</strong>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;


// import { useEffect, useState } from "react";
// import { getInspections } from "../services/api";

// function Dashboard({
//   user,
//   onLogout,
//   onNewInspection,
// }) {
//   const [inspections, setInspections] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadInspections = async () => {
//       try {
//         const data = await getInspections(user.id);

//         setInspections(
//           data.inspections || []
//         );
//       } catch (error) {
//         console.error(
//           "Failed to load inspections:",
//           error.message
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user?.id) {
//       loadInspections();
//     }
//   }, [user?.id]);

//   const totalInspections =
//     inspections.length;

//   const passedInspections =
//     inspections.filter(
//       (inspection) =>
//         inspection.status === "PASSED"
//     ).length;

//   const potentialViolations =
//     inspections.filter(
//       (inspection) =>
//         inspection.status ===
//         "POTENTIAL_VIOLATION"
//     ).length;

//   const needsVerification =
//     inspections.filter(
//       (inspection) =>
//         inspection.status ===
//         "NEEDS_VERIFICATION"
//     ).length;

//   return (
//     <div className="dashboard-page">
//       <aside className="sidebar">
//         <div className="sidebar-brand">
//           <div className="brand-mark">M</div>
//           <div>
//             <strong>METRALENS</strong>
//             <span>AI INSPECTION</span>
//           </div>
//         </div>

//         <nav className="sidebar-nav">
//           <button className="active">
//             <span>⌂</span>
//             Overview
//           </button>

//           <button onClick={onNewInspection}>
//             <span>＋</span>
//             New Inspection
//           </button>

//           <button>
//             <span>◈</span>
//             Inspection History
//           </button>

//           <button>
//             <span>▣</span>
//             Evidence Passport
//           </button>
//         </nav>

//         <div className="sidebar-bottom">
//           <div className="system-status">
//             <span className="status-dot"></span>
//             System Operational
//           </div>

//           <button className="logout-button" onClick={onLogout}>
//             Sign out
//           </button>
//         </div>
//       </aside>

//       <main className="dashboard-main">
//         <header className="dashboard-header">
//           <div>
//             <span className="dashboard-kicker">
//               INSPECTOR CONSOLE / OVERVIEW
//             </span>

//             <h1>Good evening, {user?.name || "Inspector"}.</h1>

//             <p>
//               Here's your inspection intelligence at a glance.
//             </p>
//           </div>

//           <div className="profile">
//             <div className="avatar">
//               {(user?.name || "I").charAt(0).toUpperCase()}
//             </div>

//             <div>
//               <strong>{user?.name}</strong>
//               <span>{user?.inspectorId}</span>
//             </div>
//           </div>
//         </header>

//         <section className="dashboard-hero">
//           <div>
//             <span className="dashboard-kicker">
//               READY FOR INSPECTION
//             </span>

//             <h2>
//               Inspect a package.
//               <br />
//               <span>Verify the evidence.</span>
//             </h2>

//             <p>
//               Capture package images and let METRALENS analyse
//               declarations, evidence quality and compliance.
//             </p>

//             <button
//               className="primary-button"
//               onClick={onNewInspection}
//             >
//               + Start New Inspection
//             </button>
//           </div>

//           <div className="dashboard-orb">
//             <div className="orb-ring"></div>
//             <div className="orb-core">M</div>
//           </div>
//         </section>

//         <section className="stats-grid">
//           <div className="stat-card">
//             <span>TOTAL INSPECTIONS</span>
//             <strong>{totalInspections}</strong>
//             <small>All recorded inspections</small>
//           </div>

//           <div className="stat-card">
//             <span>PASSED</span>
//             <strong>{passedInspections}</strong>
//             <small>Verified compliant</small>
//           </div>

//           <div className="stat-card warning">
//             <span>POTENTIAL VIOLATIONS</span>
//             <strong>{potentialViolations}</strong>
//             <small>Require attention</small>
//           </div>

//           <div className="stat-card">
//             <span>NEEDS VERIFICATION</span>
//             <strong>{needsVerification}</strong>
//             <small>Insufficient evidence</small>
//           </div>
//         </section>

//         <section className="dashboard-content-grid">
//           <div className="recent-panel">
//             <div className="panel-heading">
//               <div>
//                 <span>INSPECTION ACTIVITY</span>
//                 <h3>Recent inspections</h3>
//               </div>

//               <button>View all →</button>
//             </div>

//             <div className="empty-state">
//               <div className="empty-icon">◈</div>
//               <h4>No inspections yet</h4>
//               <p>
//                 Your completed inspections will appear here with
//                 their compliance status and evidence trail.
//               </p>

//               <button
//                 className="secondary-button"
//                 onClick={onNewInspection}
//               >
//                 Start first inspection
//               </button>
//             </div>
//           </div>

//           <div className="integrity-panel">
//             <span>INSPECTION INTEGRITY</span>

//             <h3>Evidence-first workflow</h3>

//             <div className="integrity-list">
//               <div>
//                 <span>01</span>
//                 <p>Image quality gate</p>
//                 <strong>READY</strong>
//               </div>

//               <div>
//                 <span>02</span>
//                 <p>AI + OCR analysis</p>
//                 <strong>READY</strong>
//               </div>

//               <div>
//                 <span>03</span>
//                 <p>Rule verification</p>
//                 <strong>READY</strong>
//               </div>

//               <div>
//                 <span>04</span>
//                 <p>Evidence passport</p>
//                 <strong>READY</strong>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }

// export default Dashboard;