import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createTest, getAllQuestions } from "../../../services/admin.api";

const CATEGORY_OPTIONS = ["CODING", "APTITUDE", "LOGICAL", "VERBAL"];

function CreateTestModal({ onClose, onConfirm }) {
  const [form, setForm] = useState({
    title: "",
    category: "CODING",
    description: "",
    duration: "",
    minQuestionToAttempt: "",
  });

  const [questions, setQuestions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // fetch questions when category changes
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoadingQuestions(true);
        const res = await getAllQuestions({
          category: form.category,
        });
        setQuestions(res.data.data.questions || []);
      } catch {
        toast.error("Failed to load questions");
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [form.category]);

  const toggleQuestion = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((q) => q !== id)
        : [...prev, id]
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedIds.length === 0) {
      toast.error("Select at least one question");
      return;
    }

    const payload = {
      title: form.title,
      category: form.category,
      description: form.description,
      duration: Number(form.duration),
      questionIds: selectedIds,
      rules: {
        minQuestionToAttempt: Number(form.minQuestionToAttempt),
      },
    };

    try {
      setSubmitting(true);
      await createTest(payload);
      toast.success("Test created successfully");
      onConfirm();
      onClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to create test"
      );
    } finally {
      setSubmitting(false);
    }
  };

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
          Create Test
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Basic info */}
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Test title"
            required
            className="w-full rounded-lg border px-4 py-2"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full rounded-lg border px-4 py-2"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            required
            placeholder="Description"
            className="w-full rounded-lg border px-4 py-2"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              name="duration"
              type="number"
              required
              value={form.duration}
              onChange={handleChange}
              placeholder="Duration (minutes)"
              className="rounded-lg border px-4 py-2"
            />

            <input
              name="minQuestionToAttempt"
              type="number"
              required
              value={form.minQuestionToAttempt}
              onChange={handleChange}
              placeholder="Min questions to attempt"
              className="rounded-lg border px-4 py-2"
            />
          </div>

          {/* Questions */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Select Questions
            </p>

            <div className="max-h-64 overflow-y-auto rounded-lg border">
              {loadingQuestions ? (
                <p className="p-4 text-gray-500">Loading...</p>
              ) : (
                questions.map((q) => (
                  <label
                    key={q._id}
                    className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-purple-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(q._id)}
                      onChange={() => toggleQuestion(q._id)}
                      className="accent-purple-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {q.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {q.difficulty} • {q.questionType}
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Actions */}
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
              {submitting ? "Creating..." : "Create Test"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTestModal;
