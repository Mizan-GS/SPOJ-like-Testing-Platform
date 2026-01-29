import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosClient from "../../../../services/axiosClient";

function AssessmentsListModal({ onClose }) {
  /* =========================
     STATE
  ========================= */
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH ASSESSMENTS
  ========================= */
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const res = await axiosClient.get("/assessments");
        setAssessments(res.data.data?.result || []);
      } catch (err) {
        toast.error(
          err?.response?.data?.message ||
            "Failed to load assessments"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  /* =========================
     UI
  ========================= */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative z-10 w-full max-w-3xl rounded-2xl bg-white shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            All Assessments
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-4">
          {loading && (
            <p className="text-center text-gray-500">
              Loading assessments...
            </p>
          )}

          {!loading && assessments.length === 0 && (
            <p className="text-center text-gray-500">
              No assessments found
            </p>
          )}

          {assessments.filter((assessment) =>assessment.isActive)
          .map ((assessment)=>(
            <div
              key={assessment._id}
              className="rounded-xl border bg-gray-50 px-5 py-4 hover:shadow-sm transition"
            >
              <h3 className="font-medium text-gray-800">
                {assessment.title}
              </h3>

              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                <span>
                  🧩 {assessment.sections.length} sections
                </span>
                <span>
                  ⏱ {assessment.totalDuration} min
                </span>
                <span>
                  📌 {assessment.assessmentType}
                </span>
                <span
                  className={`font-medium ${
                    assessment.isActive
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {assessment.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="mt-2 text-xs text-gray-400">
                Created on{" "}
                {new Date(
                  assessment.createdAt
                ).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AssessmentsListModal;
