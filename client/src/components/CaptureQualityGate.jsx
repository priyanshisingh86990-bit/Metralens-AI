import { useEffect, useRef, useState } from "react";
import {
    uploadInspectionEvidence,
} from "../services/api";

function CaptureQualityGate({
    user,
    inspection,
    onBack,
    onContinue,
}) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const [activeSide, setActiveSide] =
        useState("front");

    const [images, setImages] = useState({
        front: null,
        back: null,
        left: null,
        right: null,
    });

    const [cameraOpen, setCameraOpen] =
        useState(false);

    const [cameraError, setCameraError] =
        useState("");

    const [uploading, setUploading] =
        useState(false);

    const [uploadError, setUploadError] =
        useState("");

    const sideNames = {
        front: "Front",
        back: "Back",
        left: "Left",
        right: "Right",
    };

    const capturedCount = Object.values(
        images
    ).filter(Boolean).length;


    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current
                    .getTracks()
                    .forEach((track) =>
                        track.stop()
                    );
            }
        };
    }, []);

    useEffect(() => {
        if (
            cameraOpen &&
            videoRef.current &&
            streamRef.current
        ) {
            videoRef.current.srcObject =
                streamRef.current;

            videoRef.current.play().catch((error) => {
                console.error(
                    "Video playback error:",
                    error
                );
            });
        }
    }, [cameraOpen]);

    const openCamera = async () => {
        try {
            setCameraError("");

            const stream =
                await navigator.mediaDevices.getUserMedia(
                    {
                        video: {
                            facingMode: "environment",
                        },
                        audio: false,
                    }
                );

            streamRef.current = stream;

            setCameraOpen(true);
        } catch (error) {
            console.error(
                "Camera access error:",
                error
            );

            setCameraError(
                "Camera access was unavailable. Please allow camera permission or use image upload."
            );
        }
    };

    const closeCamera = () => {
        if (streamRef.current) {
            streamRef.current
                .getTracks()
                .forEach((track) =>
                    track.stop()
                );

            streamRef.current = null;
        }

        setCameraOpen(false);
    };

    const captureImage = () => {
        const video =
            videoRef.current;

        if (!video) {
            return;
        }

        const canvas =
            document.createElement(
                "canvas"
            );

        canvas.width =
            video.videoWidth;

        canvas.height =
            video.videoHeight;

        const context =
            canvas.getContext("2d");

        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );

        canvas.toBlob(
            async (blob) => {
                if (!blob) {
                    return;
                }

                const file = new File(
                    [blob],
                    `${activeSide}-${Date.now()}.jpg`,
                    {
                        type: "image/jpeg",
                    }
                );

                try {
                    setUploading(true);
                    setUploadError("");

                    const data =
                        await uploadInspectionEvidence({
                            inspectionId:
                                inspection.inspectionId,

                            side: activeSide,

                            image: file,
                        });

                    const imageUrl =
                        URL.createObjectURL(
                            blob
                        );

                    setImages(
                        (previous) => ({
                            ...previous,

                            [activeSide]: {
                                preview: imageUrl,
                                file,
                                serverUrl:
                                    data.evidence.url,
                            },
                        })
                    );

                    closeCamera();
                } catch (error) {
                    console.error(
                        "Camera evidence upload failed:",
                        error.message
                    );

                    setUploadError(
                        error.message
                    );
                } finally {
                    setUploading(false);
                }
            },
            "image/jpeg",
            0.9
        );
    };

    const handleUpload = async (
        event
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        try {
            setUploading(true);
            setUploadError("");

            const data =
                await uploadInspectionEvidence({
                    inspectionId:
                        inspection.inspectionId,

                    side: activeSide,

                    image: file,
                });

            const imageUrl =
                URL.createObjectURL(file);

            setImages((previous) => ({
                ...previous,
                [activeSide]: {
                    preview: imageUrl,
                    file,
                    serverUrl:
                        data.evidence.url,
                },
            }));

        } catch (error) {
            console.error(
                "Evidence upload failed:",
                error.message
            );

            setUploadError(
                error.message
            );
        } finally {
            setUploading(false);
            event.target.value = "";
        }
    };

    const removeImage = (side) => {
        const currentImage =
            images[side];

        if (
            currentImage &&
            typeof currentImage === "object" &&
            currentImage.preview
        ) {
            URL.revokeObjectURL(
                currentImage.preview
            );
        }

        setImages((previous) => ({
            ...previous,
            [side]: null,
        }));
    };

    const getPreview = (image) => {
        if (!image) {
            return null;
        }

        if (typeof image === "string") {
            return image;
        }

        return image.preview;
    };

    const handleContinue = () => {
        console.log(
            "Captured evidence:",
            images
        );

        onContinue(images);
    };

    return (
        <div className="capture-page">
            <header className="capture-header">
                <div>
                    <button
                        className="capture-back"
                        onClick={onBack}
                    >
                        ← Back
                    </button>

                    <span className="dashboard-kicker">
                        INSPECTION / EVIDENCE CAPTURE
                    </span>

                    <h1>
                        Capture package evidence
                    </h1>

                    <p>
                        Capture clear images of the
                        package panels for this
                        inspection record.
                    </p>
                </div>

                <div className="capture-inspection-info">
                    <span>
                        INSPECTION ID
                    </span>

                    <strong>
                        {inspection?.inspectionId}
                    </strong>

                    <small>
                        Inspector:{" "}
                        {user?.name}
                    </small>
                </div>
            </header>

            <main className="capture-main">
                <section className="capture-intro">
                    <div>
                        <span>
                            PACKAGE COVERAGE
                        </span>

                        <h2>
                            Capture every visible side.
                        </h2>

                        <p>
                            Use your camera or upload
                            an existing image. Each
                            captured panel becomes part
                            of this inspection's
                            evidence record.
                        </p>
                    </div>

                    <div className="capture-progress">
                        <strong>
                            {capturedCount}/4
                        </strong>

                        <span>
                            sides captured
                        </span>
                    </div>
                </section>

                <section className="capture-layout">
                    <div className="capture-side-grid">
                        {Object.keys(sideNames).map(
                            (side) => {
                                const image =
                                    images[side];

                                return (
                                    <button
                                        key={side}
                                        className={`capture-card ${activeSide === side
                                            ? "capture-card-active"
                                            : ""
                                            } ${image
                                                ? "capture-card-complete"
                                                : ""
                                            }`}
                                        onClick={() =>
                                            setActiveSide(side)
                                        }
                                    >
                                        <div className="capture-card-top">
                                            <span>
                                                {side ===
                                                    "front"
                                                    ? "01"
                                                    : side ===
                                                        "back"
                                                        ? "02"
                                                        : side ===
                                                            "left"
                                                            ? "03"
                                                            : "04"}
                                            </span>

                                            {image && (
                                                <span className="capture-check">
                                                    ✓
                                                </span>
                                            )}
                                        </div>

                                        <div className="capture-preview">
                                            {image ? (
                                                <img
                                                    src={getPreview(
                                                        image
                                                    )}
                                                    alt={`${sideNames[side]} package`}
                                                />
                                            ) : (
                                                <div className="capture-placeholder">
                                                    <span>
                                                        ◇
                                                    </span>
                                                    <small>
                                                        No evidence
                                                    </small>
                                                </div>
                                            )}
                                        </div>

                                        <div className="capture-card-footer">
                                            <strong>
                                                {sideNames[side]}
                                            </strong>

                                            <span>
                                                {image
                                                    ? "Captured"
                                                    : "Awaiting capture"}
                                            </span>
                                        </div>
                                    </button>
                                );
                            }
                        )}
                    </div>

                    <aside className="capture-control-panel">
                        <span className="dashboard-kicker">
                            ACTIVE PANEL
                        </span>

                        <h3>
                            {sideNames[activeSide]}
                        </h3>

                        <p>
                            Capture the{" "}
                            {sideNames[
                                activeSide
                            ].toLowerCase()} side of
                            the package.
                        </p>

                        {cameraError && (
                            <div className="capture-error">
                                {cameraError}
                            </div>
                        )}
                        {uploading && (
                            <div className="capture-uploading">
                                Uploading evidence...
                            </div>
                        )}

                        {uploadError && (
                            <div className="capture-error">
                                {uploadError}
                            </div>
                        )}

                        {cameraOpen ? (
                            <div className="camera-box">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                />

                                <button
                                    className="capture-shutter"
                                    onClick={
                                        captureImage
                                    }
                                >
                                    Capture
                                </button>

                                <button
                                    className="camera-close"
                                    onClick={
                                        closeCamera
                                    }
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    className="capture-camera-button"
                                    onClick={openCamera}
                                    disabled={uploading}
                                >
                                    <span>◎</span>
                                    Use Camera
                                </button>

                                <label className="capture-upload-button">
                                    <span>↑</span>
                                    Upload Image

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleUpload}
                                        disabled={uploading}
                                    />
                                </label>
                            </>
                        )}

                        {images[activeSide] && (
                            <button
                                className="capture-remove-button"
                                onClick={() =>
                                    removeImage(
                                        activeSide
                                    )
                                }
                            >
                                Remove captured image
                            </button>
                        )}

                        <div className="capture-guidance">
                            <span>
                                EVIDENCE GUIDANCE
                            </span>

                            <p>
                                Keep the package fully
                                visible. Avoid heavy glare,
                                extreme blur and blocked
                                declaration areas.
                            </p>
                        </div>
                    </aside>
                </section>

                <section className="capture-footer">
                    <div>
                        <span>
                            CAPTURE STATUS
                        </span>

                        <strong>
                            {capturedCount === 0
                                ? "No evidence captured"
                                : capturedCount === 4
                                    ? "All package sides captured"
                                    : `${capturedCount} of 4 sides captured`}
                        </strong>
                    </div>

                    <button
                        className="primary-button"
                        disabled={
                            capturedCount === 0
                        }
                        onClick={
                            handleContinue
                        }
                    >
                        Continue to Analysis →
                    </button>
                </section>
            </main>
        </div>
    );
}

export default CaptureQualityGate;