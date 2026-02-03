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

  /* ================= FETCH QUESTIONS ================= */
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

  /* ================= SUBMIT ================= */
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
        minQuestionToAttempt: Number(
          form.minQuestionToAttempt
        ),
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
        err?.response?.data?.message ||
          "Failed to create test"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-xl font-semibold text-gray-800">
          Create Test
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* ================= BASIC INFO ================= */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Test Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border px-4 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border px-4 py-2"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={8}
              required
              className="mt-1 w-full rounded-lg border px-4 py-2"
            />
          </div>

          {/* ================= RULES ================= */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Duration (minutes)
              </label>
              <input
                name="duration"
                type="number"
                required
                min={1}
                value={form.duration}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border px-4 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Min Questions to Attempt
              </label>
              <input
                name="minQuestionToAttempt"
                type="number"
                required
                min={1}
                value={form.minQuestionToAttempt}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border px-4 py-2"
              />
            </div>
          </div>

          {/* ================= QUESTIONS ================= */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Select Questions
            </label>

            <div className="max-h-64 overflow-y-auto rounded-lg border">
              {loadingQuestions ? (
                <p className="p-4 text-gray-500">
                  Loading...
                </p>
              ) : (
                questions.map((q) => (
                  <label
                    key={q._id}
                    className="flex cursor-pointer items-start gap-3 border-b px-4 py-3 last:border-b-0 hover:bg-purple-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(
                        q._id
                      )}
                      onChange={() =>
                        toggleQuestion(q._id)
                      }
                      className="mt-1 accent-purple-500"
                    />

                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {q.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {q.difficulty} •{" "}
                        {q.questionType}
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* ================= ACTIONS ================= */}
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
              {submitting
                ? "Creating..."
                : "Create Test"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTestModal;
