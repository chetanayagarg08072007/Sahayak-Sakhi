import React from "react";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Home from "./pages/Home";
import ModeSelect from "./pages/ModeSelect";
import VoiceAssessment from "./pages/VoiceAssessment";
import Assessment from "./pages/Assessment";
import VerifyAssessment from "./pages/VerifyAssessment";
import Dashboard from "./pages/Dashboard";
import SchemeDetails from "./pages/SchemeDetails";
import Tracker from "./pages/Tracker";
import AIHelper from "./components/AIHelper";

function App() {
  return (
    <UserProvider>
      <HashRouter>
        <div className="app-container" style={{ position: "relative" }}>
          <header className="header">
            <Link to="/" style={{ textDecoration: "none" }}>
              <h1>Sahayak Sakhi</h1>
            </Link>
          </header>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mode-select" element={<ModeSelect />} />
              <Route path="/voice-assessment" element={<VoiceAssessment />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/verify-assessment" element={<VerifyAssessment />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/scheme/:id" element={<SchemeDetails />} />
              <Route path="/tracker" element={<Tracker />} />
            </Routes>
          </main>

          {/* AI Voice and Chat Assistant is always available across the entire site */}
          <AIHelper />
        </div>
      </HashRouter>
    </UserProvider>
  );
}

export default App;
