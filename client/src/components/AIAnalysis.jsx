import { useEffect, useRef, useState } from "react";
import { analyzeInspection } from "../services/api";
import "./AIAnalysis.css";

const steps = [
    {
        id: 1,
        title: "Image quality",
        description: "Checking clarity, brightness and glare",
    },
    {
        id: 2,
        title: "OCR extraction",
        description: "Reading declarations from package images",
    },
    {
        id: 3,
        title: "AI analysis",
        description: "Identifying visible package declarations",
    },
    {
        id: 4,
        title: "Evidence mapping",
        description: "Linking observations to captured evidence",
    },
    {
        id: 5,
        title: "Cross-panel verification",
        description: "Checking consistency across package sides",
    },
];

export default function AIAnalysis({
    inspection,
    onComplete,
    onBack,
}) {
    //const [activeStep, setActiveStep] = useState(1);
    //const [progress, setProgress] = useState(8);
    const [activeStep, setActiveStep] = useState(1);
    const [progress, setProgress] = useState(5);
    const [analysisStatus, setAnalysisStatus] = useState("PROCESSING");
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);
    const analysisStartedRef = useRef(false);


    useEffect(() => {
        if (analysisStartedRef.current) {
            return;
        }

        analysisStartedRef.current = true;


        if (!inspection?.inspectionId) {
            setError("Inspection ID is missing.");
            setAnalysisStatus("FAILED");
            return;
        }

        let mounted = true;

        const startAnalysis = async () => {
            try {
                setAnalysisStatus("PROCESSING");
                setError("");

                setActiveStep(1);
                setProgress(10);

                const stepTimer1 = setTimeout(() => {
                    if (mounted) {
                        setActiveStep(2);
                        setProgress(30);
                    }
                }, 1200);

                const stepTimer2 = setTimeout(() => {
                    if (mounted) {
                        setActiveStep(3);
                        setProgress(50);
                    }
                }, 2800);

                const stepTimer3 = setTimeout(() => {
                    if (mounted) {
                        setActiveStep(4);
                        setProgress(70);
                    }
                }, 5000);

                const data = await analyzeInspection(
                    inspection.inspectionId
                );

                clearTimeout(stepTimer1);
                clearTimeout(stepTimer2);
                clearTimeout(stepTimer3);

                if (!mounted) return;

                setResult(data);

                setActiveStep(5);
                setProgress(100);

                setAnalysisStatus(
                    data.aiAnalysis?.status || "COMPLETED"
                );
            } catch (error) {
                if (!mounted) return;

                console.error("AI analysis error:", error);

                setAnalysisStatus("FAILED");
                setError(error.message || "AI analysis failed.");
            }
        };

        startAnalysis();

        return () => {
            mounted = false;
        };
    }, [inspection?.inspectionId]);

    return (
        <div className="ai-analysis-page">

            {/* Header */}
            <header className="ai-analysis-header">
                <div className="ai-brand">
                    <div className="ai-brand-mark">M</div>

                    <div>
                        <h2>METRALENS AI</h2>
                        <span>See. Verify. Prove.</span>
                    </div>
                </div>

                <div className="inspection-chip">
                    <span>Inspection</span>
                    <strong>
                        {inspection?.inspectionId || "ML-PENDING"}
                    </strong>
                </div>
            </header>

            {/* Main */}
            <main className="ai-analysis-main">

                <section className="analysis-card">

                    {/* AI icon */}
                    <div className="ai-orb">
                        <div className="ai-orb-inner">
                            ✦
                        </div>
                    </div>

                    <p className="analysis-label">
                        INTELLIGENT INSPECTION
                    </p>

                    <h1>
                        Analyzing package evidence
                    </h1>

                    <p className="analysis-subtitle">
                        METRALENS AI is examining the captured package
                        images and extracting verifiable declarations.
                    </p>

                    {/* Progress */}
                    <div className="progress-section">

                        <div className="progress-info">
                            <span>Analysis progress</span>
                            <strong>{progress}%</strong>
                        </div>

                        <div className="progress-track">
                            <div
                                className="progress-fill"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                    </div>

                    {/* Steps */}
                    <div className="analysis-steps">

                        {steps.map((step) => {

                            const completed = step.id < activeStep;
                            const active = step.id === activeStep;

                            return (
                                <div
                                    className={`analysis-step ${completed
                                        ? "completed"
                                        : active
                                            ? "active"
                                            : ""
                                        }`}
                                    key={step.id}
                                >

                                    <div className="step-indicator">
                                        {completed ? "✓" : step.id}
                                    </div>

                                    <div className="step-content">
                                        <strong>{step.title}</strong>
                                        <span>{step.description}</span>
                                    </div>

                                    {active && (
                                        <div className="step-loader">
                                            <span />
                                            <span />
                                            <span />
                                        </div>
                                    )}

                                </div>
                            );
                        })}

                    </div>

                    {/* Footer note */}
                    <div className="analysis-note">
                        <span>●</span>
                        AI observations never replace the deterministic
                        compliance rules.
                    </div>

                </section>

            </main>

            {/* Bottom */}
            <footer className="ai-analysis-footer">

                <button
                    className="back-button"
                    onClick={onBack}
                >
                    ← Back
                </button>

                <p>
                    Processing inspection evidence securely
                </p>

                {analysisStatus === "PROCESSING" && (
                    <div className="analysis-processing">
                        AI is analyzing the captured evidence...
                    </div>
                )}

                {analysisStatus === "FAILED" && (
                    <div className="analysis-error">
                        <strong>Analysis failed</strong>
                        <span>{error}</span>
                    </div>
                )}

                {analysisStatus !== "PROCESSING" &&
                    analysisStatus !== "FAILED" && (
                        <button
                            className="continue-button"
                            onClick={() => onComplete(result)}
                        >
                            View Compliance Result →
                        </button>
                    )}

            </footer>

        </div>
    );
}