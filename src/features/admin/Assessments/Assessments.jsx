import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getAllAssessments } from "../../../services/admin.api";
import CreateAssessmentModal from "./AssessmentFormModal.jsx";
import AssessmentFormModal from "./AssessmentFormModal.jsx";
import { deleteAssessment } from "../../../services/admin.api";
function Assessments() {
  /* =========================
     STATE: DATA
  ========================= */
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  /* =========================
     STATE: MODAL
  ========================= */
  const [showCreateModal, setShowCreateModal] = useState(false);

  /* =========================
     FETCH ASSESSMENTS
  ========================= */
  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const res = await getAllAssessments({ isActive: true });
      setAssessments(res.data.data.result || []);
      console.log(res.data.data.result);
      
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to load assessments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);
  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleDelete = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this assessment?"
  );

  if (!confirmed) return;

  try {
    await deleteAssessment(id);

    toast.success("Assessment deleted");

    // remove from active list immediately
    setAssessments((prev) =>
      prev.filter((a) => a._id !== id)
    );
  } catch (err) {
    toast.error(
      err?.response?.data?.message ||
        "Failed to delete assessment"
    );
  }
};


  /* =========================
     RENDER
  ========================= */
  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Assessments
          </h1>
          <p className="text-sm text-gray-500">
            Pool-based assessments configuration
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-lg bg-purple-500 px-6 py-2 text-sm font-medium text-white hover:bg-purple-600"
        >
          + Create Assessment
        </button>
      </div>

      {/* ================= LIST ================= */}
      {loading ? (
        <div className="text-gray-500">Loading assessments...</div>
      ) : assessments.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
          No assessments created yet
        </div>
      ) : (
        <div className="space-y-4">
          {assessments.map((a) => (
            <div
              key={a._id}
              className="flex items-center justify-between rounded-xl border bg-white px-6 py-4 shadow-sm hover:bg-purple-50 transition"
              onClick={() => setEditingId(a._id)}
            >
              {/* LEFT */}
              <div className="space-y-1">
                <h3 className="font-medium text-gray-900">
                  {a.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {a.sections?.length || 0} sections • {a.totalDuration || 0} mins
                </p>
              </div>

              {/* RIGHT ACTIONS */}
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {e.stopPropagation();
                    setEditingId(a._id)}}
                  className="rounded-lg border px-4 py-2 text-sm hover:bg-purple-100"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(a._id)}
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>

          ))}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {showCreateModal && (
        <AssessmentFormModal
          mode="create"
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchAssessments}
        />
      )}

      {editingId && (
        <AssessmentFormModal
          mode="edit"
          assessmentId={editingId}
          onClose={() => setEditingId(null)}
          onSuccess={fetchAssessments}
        />
      )}
    </div>
  );
}

export default Assessments;
