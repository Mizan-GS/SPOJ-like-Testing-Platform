import React, { useEffect, useState } from "react";
import { getAllTests } from "../../../services/admin.api";
import { toast } from "react-toastify";
import CreateTestModal from "./CreateTestModal";
import { deleteTest } from "../../../services/admin.api";
import EditTestModal from "./EditTestModal";
import { Navigate, useNavigate } from "react-router-dom";
function TestList() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId , setEditingId] = useState(null)

  const navigate = useNavigate();
  const handleDelete = async (testId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this test?\n\nThis action can be reversed later."
    );

    if (!confirmed) return;

    try {
      await deleteTest(testId);
      toast.success("Test deleted successfully");

      // remove from UI immediately
      setTests((prev) => prev.filter((t) => t._id !== testId));
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to delete test"
      );
    }
  };


  const fetchTests = async () => {
    try {
      const res = await getAllTests();
      setTests(res.data.data || []);
    } catch {
      toast.error("Failed to load tests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          Tests
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-lg bg-purple-500 px-4 py-2 text-sm text-white hover:bg-purple-600"
          >
            + Create Test
          </button>
          <button
              onClick={() => navigate("/admin/tests/deleted")}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
            >
              🗑 Deleted Tests
            </button>
          </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="rounded-xl border bg-white">
          {tests.map((t) => (
            <div
              key={t._id}
              className="flex items-center justify-between px-6 py-4 border-b last:border-b-0"
              onClick={()=>setEditingId(t._id)}
            >
              <div>
                <p className="font-medium text-gray-800">{t.title}</p>
                <p className="text-sm text-gray-500">
                  {t.duration} mins • {t.totalQuestions} questions
                </p>
              </div>

              <div className="flex gap-3">
                <button
                 className="text-sm text-purple-600 hover:underline"
                 onClick={(e)=>{
                  e.stopPropagation();
                  setEditingId(t._id)}}
                 >
                  Edit
                </button>
                <button 
                className="text-sm text-red-600 hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(t._id)}}
                >
                  Delete
                </button>
              </div>
            </div>

          ))}

          {tests.length === 0 && (
            <p className="px-6 py-10 text-center text-gray-500">
              No tests created yet
            </p>
          )}
        </div>
      )}

      {showCreate && (
        <CreateTestModal
          onClose={() => setShowCreate(false)}
          onConfirm={fetchTests}
        />
      )}

      {editingId && (
        <EditTestModal
          testId={editingId}
          onClose={() => setEditingId(null)}
          onUpdated={fetchTests}
        />
      )}

    </div>
  );
}

export default TestList;
