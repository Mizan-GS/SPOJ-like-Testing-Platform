import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosClient from "../../../../services/axiosClient";
import AttemptsTable from "./AttemptsTable";

function TestAccordionRow({ test, isOpen, onToggle }) {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchAttempts = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(
          `/analytics/admin/test-attempts/${test.testId}`
        );
        setAttempts(res.data.data || []);
      } catch {
        toast.error("Failed to load attempts");
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [isOpen, test.testId]);

  return (
    <div className="rounded-xl border border-border bg-bg">
      {/* Header row */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div>
          <p className="font-medium text-text">
            {test.title}
          </p>
          <p className="text-sm text-text/60">
            Attempts: {test.totalTestAttempts}
          </p>
        </div>

        <span className="text-text text-xl">
          {isOpen ? "−" : "+"}
        </span>
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="px-4 pb-4">
          {loading ? (
            <p className="text-text/60">Loading attempts...</p>
          ) : attempts.length === 0 ? (
            <p className="text-text/60">No attempts found</p>
          ) : (
            <AttemptsTable attempts={attempts} />
          )}
        </div>
      )}
    </div>
  );
}

export default TestAccordionRow;
