import { useState } from "react";

import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import NewInspection from "./components/NewInspection";
import InspectionHistory from "./components/InspectionHistory";
import CaptureQualityGate from "./components/CaptureQualityGate";

function App() {
  const [page, setPage] = useState("home");
  const [activeInspection, setActiveInspection] =
    useState(null);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("metralens_user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (loggedInUser) => {
    localStorage.setItem(
      "metralens_user",
      JSON.stringify(loggedInUser)
    );

    setUser(loggedInUser);
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("metralens_user");
    setUser(null);
    setPage("home");
  };

  const handleSignup = (newUser) => {
    localStorage.setItem(
      "metralens_user",
      JSON.stringify(newUser)
    );

    setUser(newUser);
    setPage("dashboard");
  };

  if (user && page === "new-inspection") {
    return (
      <NewInspection
        user={user}
        onBack={() => setPage("dashboard")}
        onCreated={(inspection) => {
          console.log(
            "Inspection created:",
            inspection
          );

          setActiveInspection(inspection);
          setPage("capture");
        }}
      />
    );
  }

  if (
    user &&
    page === "capture" &&
    activeInspection
  ) {
    return (
      <CaptureQualityGate
        user={user}
        inspection={activeInspection}
        onBack={() =>
          setPage("new-inspection")
        }
        onContinue={() => {
          console.log(
            "Evidence capture complete:",
            activeInspection
          );

          setPage("dashboard");
        }}
      />
    );
  }

  if (user && page === "history") {
    return (
      <InspectionHistory
        user={user}
        onBack={() => setPage("dashboard")}
        onNewInspection={() =>
          setPage("new-inspection")
        }
        onOpenInspection={(inspection) => {
          setActiveInspection(inspection);

          if (
            inspection.status ===
            "CAPTURE_PENDING"
          ) {
            setPage("capture");
          }
        }}
      />
    );
  }

  if (user) {
    return (
      <Dashboard
        user={user}
        onLogout={handleLogout}
        onNewInspection={() =>
          setPage("new-inspection")
        }
        onViewHistory={() =>
          setPage("history")
        }
      />
    );
  }

  if (page === "login") {
    return (
      <Login
        onLogin={handleLogin}
        onSignup={() => setPage("signup")}
        onBack={() => setPage("home")}
      />
    );
  }

  if (page === "signup") {
    return (
      <Signup
        onSignup={handleSignup}
        onBackToLogin={() => setPage("login")}
      />
    );
  }

  return (
    <Home
      onGetStarted={() => setPage("login")}
    />
  );
}

export default App;