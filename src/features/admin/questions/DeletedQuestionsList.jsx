import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getDeletedQuestions,
  restoreQuestion,
} from "../../../services/admin.api";

function DeletedQuestionsList() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    difficulty: "",
    category: "",
    questionType: "",
    });

const [showFilters, setShowFilters] = useState(false);

  const fetchDeletedQuestions = async () => {
    try {
      const res = await getDeletedQuestions(filters);
      setQuestions(res.data.data.questions);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load deleted questions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedQuestions();
  }, []);
  useEffect(() => {
    fetchDeletedQuestions();
  }, [filters]);

  const handleRestore = async (id) => {
    try {
      await restoreQuestion(id);
      toast.success("Question restored successfully");
      fetchDeletedQuestions(); // refresh bin
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to restore question"
      );
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading deleted questions…</div>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Deleted Questions
        </h1>
        <p className="text-sm text-gray-500">
          Restore questions that were previously deleted
        </p>
      </div>

      {/* ---------------- FILTER BAR ---------------- */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        {/* Search */}
        <input
            placeholder="Search deleted questions..."
            value={filters.search}
            onChange={(e) =>
            setFilters((p) => ({ ...p, search: e.target.value }))
            }
            className="flex-1 rounded-lg border px-4 py-2"
        />

        {/* Filters toggle */}
        <button
            onClick={() => setShowFilters((p) => !p)}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-purple-50"
        >
            Filters
        </button>

        {/* Clear */}
        {(filters.search ||
            filters.difficulty ||
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




      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 text-left font-medium">
                Title
              </th>
              <th className="px-6 py-4 text-center font-medium">
                Category
              </th>
              <th className="px-6 py-4 text-center font-medium">
                Type
              </th>
              <th className="px-6 py-4 text-center font-medium">
                Difficulty
              </th>
              <th className="px-6 py-4 text-right font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {questions.map((q) => (
              <tr
                key={q._id}
                className="border-t hover:bg-purple-50"
              >
                <td className="px-6 py-4 font-medium text-gray-800">
                  {q.title}
                </td>

                <td className="px-6 py-4 text-center text-gray-700">
                  {q.category}
                </td>

                <td className="px-6 py-4 text-center text-gray-700">
                  {q.questionType}
                </td>

                <td className="px-6 py-4 text-center text-gray-700">
                  {q.difficulty}
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleRestore(q._id)}
                    className="text-sm text-green-600 hover:underline"
                  >
                    Restore
                  </button>
                </td>
              </tr>
            ))}

            {questions.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No deleted questions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DeletedQuestionsList;
