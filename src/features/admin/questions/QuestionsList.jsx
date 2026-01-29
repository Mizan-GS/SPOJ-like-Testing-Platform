import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CreateQuestion from "./CreateQuestion";
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
  const [showCreateModal, setShowCreateModal] = useState(false);

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
    console.log(res.data.data.questions);
    
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
            onClick={() => setShowCreateModal(true)}
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
      <div className="grid sm:grid-cols-1 lg:grid-cols-2 grid-cols-3 gap-4">
  {paginatedQuestions.map((q) => (
    <div
      key={q._id}
      onClick={() => setViewingId(q._id)}
      className="group cursor-pointer rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition"
    >
      {/* TITLE */}
      <h3 className="font-medium text-md text-gray-900 line-clamp-2">
        {q.description}
      </h3>

      {/* META INFO */}
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
        <span className="rounded-full bg-gray-100 px-2 py-0.5">
          {q.category}
        </span>

        <span className="rounded-full bg-gray-100 px-2 py-0.5">
          {q.questionType}
        </span>

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

      {/* TAGS */}
      {q.tags?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {q.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs rounded-md bg-purple-50 px-2 py-0.5 text-purple-700"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* ACTIONS */}
      <div className="mt-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={(e) => {
            e.stopPropagation(); // 🔴 VERY IMPORTANT
            setEditingId(q._id);
          }}
          className="rounded-lg border px-3 py-1 text-sm hover:bg-purple-50"
        >
          Edit
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation(); // 🔴 VERY IMPORTANT
            handleDelete(q._id);
          }}
          className="rounded-lg border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  ))}
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

{showCreateModal && (
  <CreateQuestion
    onClose={() => setShowCreateModal(false)}
    onSuccess={fetchQuestions}
  />
)}



    </div>

    

    
  );

  
}



export default QuestionsList;
