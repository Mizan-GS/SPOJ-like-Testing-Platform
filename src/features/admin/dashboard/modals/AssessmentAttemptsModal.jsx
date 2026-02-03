import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAssessmentAnalytics } from "../../../../services/admin.api";
import AssessmentAccordion from "../components/AssessmentAccordion"
function AssessmentAttemptsModal({ onClose }) {
  const [users, setUsers] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getAssessmentAnalytics();
        // omit users with 0 attempts
        const filtered = (res.data.data || []).filter(
          (u) => u.totalAssessmentAttempts > 0
        );
        setUsers(filtered);
      } catch {
        toast.error("Failed to load assessment analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative z-10 w-full max-w-5xl rounded-2xl bg-bg p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-xl font-semibold text-text">
            Assessment Attempts Analytics
          </h2>
          <button onClick={onClose} className="text-text text-lg">
            ✕
          </button>
        </div>

        <div className="mt-6">
          {loading ? (
            <p className="text-text/70">Loading...</p>
          ) : (
            <AssessmentAccordion
              users={users}
              expandedId={expandedId}
              onToggle={setExpandedId}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AssessmentAttemptsModal;
