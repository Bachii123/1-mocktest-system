import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import TestPage from "./pages/TestPage";
import ResultPage from "./pages/ResultPage";
import CreateTestPage from "./pages/CreateTestPage";
import AnalysisPage from "./pages/AnalysisPage";
import FacultyDashboard from "./pages/FacultyDashboard";
import FacultyAnalysisPage from "./pages/FacultyAnalysisPage";

function App() {
  const role = localStorage.getItem("role");

  return (
    <Routes>

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/test"
        element={
          role === "student"
            ? <TestPage />
            : <Navigate to="/login" />
        }
      />

      <Route
        path="/create-test"
        element={
          role === "faculty"
            ? <CreateTestPage />
            : <Navigate to="/login" />
        }
      />

      <Route
        path="/faculty-dashboard"
        element={
          role === "faculty"
            ? <FacultyDashboard />
            : <Navigate to="/login" />
        }
      />

      <Route path="/result" element={<ResultPage />} />

      {/* Student Analysis */}
      <Route path="/analysis" element={<AnalysisPage />} />

      {/* Faculty Analysis */}
      <Route
        path="/faculty-analysis/:testId"
        element={
          role === "faculty"
            ? <FacultyAnalysisPage />
            : <Navigate to="/login" />
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />

    </Routes>
  );
}

export default App;