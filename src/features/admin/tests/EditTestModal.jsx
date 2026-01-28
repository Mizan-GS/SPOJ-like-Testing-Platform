import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getTestById,
  getAllQuestions,
  updateTest,
} from "../../../services/admin.api";

const CATEGORY_OPTIONS = ["CODING", "APTITUDE", "LOGICAL", "VERBAL"];

function EditTestModal({ testId, onClose, onUpdated }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    duration: "",
    minQuestionToAttempt: "",
  });

  const [questions, setQuestions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  /* -----------------------------
     FETCH TEST + QUESTIONS
  ------------------------------ */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ fetch test
        const testRes = await getTestById(testId);
        const test = testRes.data.data;

        setForm({
          title: test.title,
          category: test.category,
          description: test.description || "",
          duration: test.duration,
          minQuestionToAttempt:
            test.rules?.minQuestionToAttempt || "",
        }); 

        setSelectedIds(test.questionIds || []);

        // 2️⃣ fetch questions of same category
        const qRes = await getAllQuestions({
          category: test.category,
        });

        const allQuestions = qRes.data.data.questions || [];

        // 3️⃣ reorder questions
        const selectedSet = new Set(test.questionIds || []);
        const ordered = [
          ...allQuestions.filter((q) => selectedSet.has(q._id)),
          ...allQuestions.filter((q) => !selectedSet.has(q._id)),
        ];

        setQuestions(ordered);
      } catch (err) {
        toast.error("Failed to load test details");
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [testId, onClose]);

  /* -----------------------------
     HANDLERS
  ------------------------------ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const toggleQuestion = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((q) => q !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedIds.length === 0) {
      toast.error("Select at least one question");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      duration: Number(form.duration),
      questionIds: selectedIds,
      rules: {
        minQuestionToAttempt: Number(form.minQuestionToAttempt),
      },
    };

    try {
      setSubmitting(true);
      await updateTest(testId, payload);
      toast.success("Test updated successfully");
      onUpdated();
      onClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update test"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-xl font-semibold text-gray-800">
          Edit Test
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2"
          />

          <select
            value={form.category}
            disabled
            className="w-full rounded-lg border bg-gray-100 px-4 py-2"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-lg border px-4 py-2"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              name="duration"
              type="number"
              value={form.duration}
              onChange={handleChange}
              className="rounded-lg border px-4 py-2"
            />

            <input
              name="minQuestionToAttempt"
              type="number"
              value={form.minQuestionToAttempt}
              onChange={handleChange}
              className="rounded-lg border px-4 py-2"
            />
          </div>

          {/* QUESTIONS */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Questions (selected on top)
            </p>

            <div className="max-h-64 overflow-y-auto rounded-lg border">
              {questions.map((q) => {
                const checked = selectedIds.includes(q._id);
                return (
                  <label
                    key={q._id}
                    className={`flex items-center gap-3 px-4 py-3 border-b last:border-b-0 cursor-pointer ${
                      checked ? "bg-purple-50" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleQuestion(q._id)}
                      className="accent-purple-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {q.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {q.difficulty} • {q.questionType}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-6 py-2"
            >
              Cancel
            </button>

            <button
              disabled={submitting}
              className="rounded-lg bg-purple-500 px-6 py-2 text-white disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTestModal;
