import { useEffect, useMemo, useState } from "react";

import { getInspections } from "../services/api";

function InspectionHistory({
    user,
    onBack,
    onNewInspection,
    onOpenInspection,
}) {
    const [inspections, setInspections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] =
        useState("ALL");

    useEffect(() => {
        const loadInspections = async () => {
            try {
                const data = await getInspections(user.id);

                setInspections(
                    data.inspections || []
                );
            } catch (error) {
                console.error(
                    "Failed to load inspection history:",
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

    const getStatusClass = (status) => {
        switch (status) {
            case "PASSED":
                return "history-status passed";

            case "POTENTIAL_VIOLATION":
                return "history-status violation";

            case "NEEDS_VERIFICATION":
                return "history-status verification";

            default:
                return "history-status pending";
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "—";
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

    const filteredInspections = useMemo(() => {
        return inspections.filter(
            (inspection) => {
                const searchText =
                    search.trim().toLowerCase();

                const matchesSearch =
                    !searchText ||
                    inspection.inspectionId
                        ?.toLowerCase()
                        .includes(searchText) ||
                    inspection.productName
                        ?.toLowerCase()
                        .includes(searchText) ||
                    inspection.brand
                        ?.toLowerCase()
                        .includes(searchText) ||
                    inspection.category
                        ?.toLowerCase()
                        .includes(searchText);

                const matchesStatus =
                    statusFilter === "ALL" ||
                    inspection.status ===
                    statusFilter;

                return (
                    matchesSearch &&
                    matchesStatus
                );
            }
        );
    }, [inspections, search, statusFilter]);

    return (
        <div className="history-page">
            <header className="history-header">
                <div className="history-header-left">
                    <button
                        className="history-back-button"
                        onClick={onBack}
                    >
                        ← Dashboard
                    </button>

                    <span className="dashboard-kicker">
                        INSPECTOR CONSOLE / RECORDS
                    </span>

                    <h1>Inspection History</h1>

                    <p>
                        Review and search your recorded
                        inspection activity.
                    </p>
                </div>

                <div className="history-header-actions">
                    <div className="history-profile">
                        <div className="avatar">
                            {(user?.name || "I")
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div>
                            <strong>
                                {user?.name}
                            </strong>

                            <span>
                                {user?.inspectorId}
                            </span>
                        </div>
                    </div>

                    <button
                        className="primary-button"
                        onClick={onNewInspection}
                    >
                        + New Inspection
                    </button>
                </div>
            </header>

            <main className="history-main">
                <section className="history-overview">
                    <div>
                        <span>
                            TOTAL RECORDS
                        </span>

                        <strong>
                            {loading
                                ? "—"
                                : inspections.length}
                        </strong>
                    </div>

                    <div>
                        <span>
                            SHOWING
                        </span>

                        <strong>
                            {loading
                                ? "—"
                                : filteredInspections.length}
                        </strong>
                    </div>

                    <div>
                        <span>
                            PENDING CAPTURE
                        </span>

                        <strong>
                            {
                                inspections.filter(
                                    (item) =>
                                        item.status ===
                                        "CAPTURE_PENDING"
                                ).length
                            }
                        </strong>
                    </div>
                </section>

                <section className="history-panel">
                    <div className="history-toolbar">
                        <div className="history-search">
                            <span>⌕</span>

                            <input
                                type="text"
                                placeholder="Search inspection ID, product, brand..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="history-filters">
                            <button
                                className={
                                    statusFilter === "ALL"
                                        ? "filter-active"
                                        : ""
                                }
                                onClick={() =>
                                    setStatusFilter("ALL")
                                }
                            >
                                All
                            </button>

                            <button
                                className={
                                    statusFilter ===
                                        "CAPTURE_PENDING"
                                        ? "filter-active"
                                        : ""
                                }
                                onClick={() =>
                                    setStatusFilter(
                                        "CAPTURE_PENDING"
                                    )
                                }
                            >
                                Pending
                            </button>

                            <button
                                className={
                                    statusFilter ===
                                        "PASSED"
                                        ? "filter-active"
                                        : ""
                                }
                                onClick={() =>
                                    setStatusFilter("PASSED")
                                }
                            >
                                Passed
                            </button>

                            <button
                                className={
                                    statusFilter ===
                                        "POTENTIAL_VIOLATION"
                                        ? "filter-active"
                                        : ""
                                }
                                onClick={() =>
                                    setStatusFilter(
                                        "POTENTIAL_VIOLATION"
                                    )
                                }
                            >
                                Violations
                            </button>

                            <button
                                className={
                                    statusFilter ===
                                        "NEEDS_VERIFICATION"
                                        ? "filter-active"
                                        : ""
                                }
                                onClick={() =>
                                    setStatusFilter(
                                        "NEEDS_VERIFICATION"
                                    )
                                }
                            >
                                Verification
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="history-empty">
                            <div className="empty-icon">
                                ◈
                            </div>

                            <h3>
                                Loading inspection records
                            </h3>

                            <p>
                                Fetching your inspection
                                history from the database.
                            </p>
                        </div>
                    ) : filteredInspections.length ===
                        0 ? (
                        <div className="history-empty">
                            <div className="empty-icon">
                                ◈
                            </div>

                            <h3>
                                No inspections found
                            </h3>

                            <p>
                                Try changing your search or
                                status filter.
                            </p>

                            {inspections.length ===
                                0 && (
                                    <button
                                        className="secondary-button"
                                        onClick={
                                            onNewInspection
                                        }
                                    >
                                        Create first inspection
                                    </button>
                                )}
                        </div>
                    ) : (
                        <div className="history-table-wrapper">
                            <div className="history-table-head">
                                <span>INSPECTION</span>
                                <span>PRODUCT</span>
                                <span>CATEGORY</span>
                                <span>DATE</span>
                                <span>STATUS</span>
                            </div>

                            <div className="history-table-body">
                                {filteredInspections.map(
                                    (inspection) => (
                                        <div
                                            className={`history-row ${inspection.status ===
                                                "CAPTURE_PENDING"
                                                ? "history-row-clickable"
                                                : ""
                                                }`}
                                            key={
                                                inspection._id ||
                                                inspection.inspectionId
                                            }
                                            onClick={() => {
                                                if (
                                                    inspection.status ===
                                                    "CAPTURE_PENDING"
                                                ) {
                                                    onOpenInspection(
                                                        inspection
                                                    );
                                                }
                                            }}
                                        >
                                            <div>
                                                <strong>
                                                    {
                                                        inspection.inspectionId
                                                    }
                                                </strong>

                                                <small>
                                                    {inspection.batchNumber
                                                        ? `Batch ${inspection.batchNumber}`
                                                        : "Inspection record"}
                                                </small>
                                            </div>

                                            <div>
                                                <strong>
                                                    {
                                                        inspection.productName
                                                    }
                                                </strong>

                                                <small>
                                                    {inspection.brand ||
                                                        "Brand not specified"}
                                                </small>
                                            </div>

                                            <div className="history-category">
                                                {
                                                    inspection.category
                                                }
                                            </div>

                                            <div className="history-date">
                                                {formatDate(
                                                    inspection.createdAt
                                                )}
                                            </div>

                                            <div>
                                                <span
                                                    className={getStatusClass(
                                                        inspection.status
                                                    )}
                                                >
                                                    {getStatusLabel(
                                                        inspection.status
                                                    )}
                                                </span>
                                                {inspection.status ===
                                                    "CAPTURE_PENDING" && (
                                                        <small className="history-action-hint">
                                                            Continue capture →
                                                        </small>
                                                    )}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default InspectionHistory;