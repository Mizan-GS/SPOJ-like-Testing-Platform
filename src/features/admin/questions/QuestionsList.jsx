import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getAllQuestions,
  deleteQuestion,
  restoreQuestion,
} from "../../../services/admin.api";

import EditQuestionModal from "./EditQuestion";

function QuestionsList() {
  const [filters, setFilters] = useState({
    search: "",
    difficulty: "",
    category: "",
    questionType: "",
  });

  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(questions.length / pageSize);

  const paginatedQuestions = questions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    fetchQuestions();
  }, [filters]);
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
     try {
    const res = await getAllQuestions(filters);
    setQuestions(res.data.data.questions);
  } catch (error) {
    toast.error("Failed to load questions",error);
  } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;

    try {
      await deleteQuestion(id);
      toast.success("Question deleted");
      fetchQuestions();
    } catch {
      toast.error("Failed to delete question");
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreQuestion(id);
      toast.success("Question restored");
      fetchQuestions();
    } catch {
      toast.error("Failed to restore question");
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading questions…</div>;
  }

  return (
    <div className="space-y-8">
      {/* ================= PAGE HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Questions
          </h1>
          <p className="text-sm text-gray-500">
            Manage active questions
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Bin link */}
          <button
            onClick={() => navigate("/admin/questions/deleted")}
            className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            🗑 Deleted Questions
          </button>

          {/* Add */}
          <button
            onClick={() => navigate("/admin/questions/create")}
            className="rounded-lg bg-purple-500 px-4 py-2 text-sm text-white hover:bg-purple-600"
          >
            + Add Question
          </button>
        </div>
      </div>

      {/* ---------------- FILTER BAR ---------------- */}
<div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
  {/* Search */}
  <input
    placeholder="Search questions..."
    value={filters.search}
    onChange={(e) =>
      setFilters((p) => ({ ...p, search: e.target.value }))
    }
    className="flex-1 rounded-lg border px-4 py-2"
  />
  

  {/* Filters Toggle */}
  <button
    onClick={() => setShowFilters((p) => !p)}
    className="rounded-lg border px-4 py-2 text-sm hover:bg-purple-50"
  >
    Filters
  </button>

  {/* Clear */}
  {(filters.difficulty ||
    filters.category ||
    filters.questionType) && (
    <button
      onClick={() =>
        setFilters({
          search: "",
          difficulty: "",
          category: "",
          questionType: "",
        })
      }
      className="text-sm text-purple-600 hover:underline"
    >
      Clear
    </button>
  )}
</div>
{showFilters && (
  <div className="mt-3 grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-3">
    <select
      value={filters.difficulty}
      onChange={(e) =>
        setFilters((p) => ({ ...p, difficulty: e.target.value }))
      }
      className="rounded-lg border px-4 py-2"
    >
      <option value="">Difficulty</option>
      <option value="EASY">Easy</option>
      <option value="MEDIUM">Medium</option>
      <option value="HARD">Hard</option>
    </select>

    <select
      value={filters.category}
      onChange={(e) =>
        setFilters((p) => ({ ...p, category: e.target.value }))
      }
      className="rounded-lg border px-4 py-2"
    >
      <option value="">Category</option>
      <option value="CODING">Coding</option>
      <option value="APTITUDE">Aptitude</option>
      <option value="LOGICAL">Logical</option>
      <option value="VERBAL">Verbal</option>
    </select>

    <select
      value={filters.questionType}
      onChange={(e) =>
        setFilters((p) => ({
          ...p,
          questionType: e.target.value,
        }))
      }
      className="rounded-lg border px-4 py-2"
    >
      <option value="">Question Type</option>
      <option value="CODING">Coding</option>
      <option value="MCQ">MCQ</option>
    </select>
  </div>
)}


{/* Active Filters */}
<div className="mt-3 flex flex-wrap gap-2">
  {filters.difficulty && (
    <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700">
      Difficulty: {filters.difficulty}
    </span>
  )}

  {filters.category && (
    <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700">
      Category: {filters.category}
    </span>
  )}

  {filters.questionType && (
    <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700">
      Type: {filters.questionType}
    </span>
  )}
</div>


      {/* ================= QUESTIONS LIST ================= */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="divide-y">
          {paginatedQuestions.map((q) => (
            <div
              key={q._id}
              onClick={() => setViewingId(q._id)}
              className="group flex items-center justify-between px-6 py-5 hover:bg-purple-50 transition"
            >
              {/* LEFT CONTENT */}
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-900">
                  {q.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span>{q.category}</span>
                  <span>•</span>
                  <span>{q.questionType}</span>
                  <span>•</span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-medium ${
                      q.difficulty === "EASY"
                        ? "bg-green-100 text-green-700"
                        : q.difficulty === "MEDIUM"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {q.difficulty}
                  </span>
                </div>
              </div>

              {/* RIGHT ACTIONS */}
              <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => setViewingId(q._id)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  View
                </button>

                <button
                  onClick={() => setEditingId(q._id)}

                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  Edit
                </button>

                {q.isActive !== false ? (
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                ) : (
                  <button
                    onClick={() => handleRestore(q._id)}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    Restore
                  </button>
                )}
              </div>
              
            </div>
            
            
          ))}

          {questions.length === 0 && (
            <div className="px-6 py-16 text-center text-gray-500">
              No questions found
            </div>
          )}
        </div>
      </div>
      {/* ================= PAGINATION ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Page size selector */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Rows per page</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:border-purple-500 focus:outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-3 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-md border px-3 py-1 disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-gray-500">
            Page {page} of {totalPages || 1}
          </span>

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border px-3 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      {editingId && (
  <EditQuestionModal
    questionId={editingId}
    onClose={() => setEditingId(null)}
    onUpdated={fetchQuestions}
  />
  
)}
{viewingId && (
  <EditQuestionModal
    questionId={viewingId}
    mode="view"
    onClose={() => setViewingId(null)}
  />
)}


    </div>

    

    
  );

  
}



export default QuestionsList;
