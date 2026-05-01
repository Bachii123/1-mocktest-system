import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./FacultyDashboard.css";

function FacultyDashboard() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const facultyId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const facultyName = localStorage.getItem("userName") || "Faculty";

  const fetchTests = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/tests/faculty/${facultyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTests(res.data || []);
    } catch (err) {
      console.error("FETCH TESTS ERROR:", err.response || err);
    } finally {
      setLoading(false);
    }
  }, [facultyId, token]);

  useEffect(() => {
    if (!facultyId || !token) {
      navigate("/");
      return;
    }
    fetchTests();
  }, [fetchTests, facultyId, token, navigate]);

  const handleDelete = async (testId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this test?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/tests/${testId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchTests();
    } catch (err) {
      console.error("DELETE TEST ERROR:", err.response || err);
    }
  };

  const handleAnalysis = (testId) => {
    navigate(`/faculty-analysis/${testId}`);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Faculty Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back, <span>{facultyName}</span>
          </p>
        </div>

        <button
          className="create-btn"
          onClick={() => navigate("/create-test")}
        >
          + Create New Test
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Tests</h3>
          <p>{tests.length}</p>
        </div>
        <div className="stat-card">
          <h3>Published</h3>
          <p>{tests.length}</p>
        </div>
        <div className="stat-card">
          <h3>Ready for Analysis</h3>
          <p>{tests.length}</p>
        </div>
      </div>

      <div className="tests-section">
        <h2 className="section-title">Your Created Tests</h2>

        {loading ? (
          <p className="empty-text">Loading tests...</p>
        ) : tests.length === 0 ? (
          <div className="empty-box">
            <h3>No tests created yet</h3>
            <p>Create your first test to get started.</p>
          </div>
        ) : (
          <div className="test-list">
            {tests.map((test, index) => (
              <div className="test-card" key={test._id}>
                <div className="test-left">
                  <div className="test-badge">{index + 1}</div>
                  <div>
                    <h3 className="test-name">{test.title}</h3>
                    <p className="test-meta">
                      {test.questions?.length || 0} Questions
                    </p>
                  </div>
                </div>

                <div className="test-actions">
                  <button
                    className="analysis-btn"
                    onClick={() => handleAnalysis(test._id)}
                  >
                    View Analysis
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(test._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FacultyDashboard;