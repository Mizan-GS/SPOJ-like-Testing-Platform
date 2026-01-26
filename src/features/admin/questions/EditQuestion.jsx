import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getQuestionById,
  updateQuestion,
} from "../../../services/admin.api";

function EditQuestionModal({
  questionId,
  mode = "edit", // "edit" | "view"
  onClose,
  onUpdated,
}) 
 {
    const isViewMode = mode === "view";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState(null);

  const isMCQ = form?.questionType === "MCQ";
  const isCoding = form?.questionType === "CODING";

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await getQuestionById(questionId);
        const q = res.data.data;

        setForm({
          title: q.title,
          description: q.description,
          category: q.category,
          questionType: q.questionType,
          difficulty: q.difficulty,
          tags: q.tags?.join(", ") || "",
          constraints: q.constraints || "",
          options: q.options || ["", "", "", ""],
          correctAnswerIndex: q.options
            ? q.options.indexOf(q.correctAnswer)
            : null,
          testCases: q.testCases
            ? JSON.stringify(q.testCases, null, 2)
            : "",
        });
      } catch {
        toast.error("Failed to load question");
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleOptionChange = (idx, value) => {
    const opts = [...form.options];
    opts[idx] = value;
    setForm((p) => ({ ...p, options: opts }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isMCQ && form.correctAnswerIndex === null) {
      toast.error("Select correct answer");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      difficulty: form.difficulty,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (isCoding) {
      payload.constraints = form.constraints;
      try {
        payload.testCases = form.testCases
          ? JSON.parse(form.testCases)
          : [];
      } catch {
        toast.error("Invalid test case JSON");
        return;
      }
    }

    if (isMCQ) {
      payload.options = form.options.filter(Boolean);
      payload.correctAnswer =
        payload.options[form.correctAnswerIndex];
    }

    try {
      setSubmitting(true);
      await updateQuestion(questionId, payload);
      toast.success("Question updated");
      onUpdated();
      onClose();
    } catch {
      toast.error("Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !form) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-xl font-semibold text-gray-800">
          {isViewMode?"Question Details":'Edit Question'}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-6"
        >
          {/* Title */}
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            disabled={isViewMode}
            className={`w-full rounded-lg border px-4 py-2 ${
                isViewMode ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            />

        


          {/* Locked fields */}
          <div className="grid grid-cols-2 gap-4">
            <input
              value={form.category}
              disabled
              className="rounded-lg border bg-gray-100 px-4 py-2"
            />
            <input
              value={form.questionType}
              disabled
              className="rounded-lg border bg-gray-100 px-4 py-2"
            />
          </div>

          {/* Description */}
             <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            disabled={isViewMode}
            rows={4}
            className={`w-full rounded-lg border px-4 py-2 ${
                isViewMode ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            />
          {isCoding && (
            <div className="space-y-6">
                <div>
                <label className="text-sm font-medium text-gray-700">
                    Constraints
                </label>
                <textarea
                    name="constraints"
                    value={form.constraints}
                    disabled={isViewMode}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 w-full rounded-lg border px-4 py-2"
                />
                </div>

                <div>
                <label className="text-sm font-medium text-gray-700">
                    Test Cases (JSON)
                </label>
                <textarea
                    name="testCases"
                    value={form.testCases}
                    disabled={isViewMode}
                    onChange={(e) =>
                    setForm((prev) => ({
                        ...prev,
                        testCases: e.target.value,
                    }))
                    }
                    rows={6}
                    className="mt-1 w-full rounded-lg border px-4 py-2 font-mono text-sm"
                />
                </div>
            </div>
            )}

            {isMCQ && (
                <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-700">
                    Options
                    </p>

                    {form.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                        <input
                        type="radio"
                        name="correctOption"
                        checked={form.correctAnswerIndex === idx}
                        onChange={() =>
                            setForm((prev) => ({
                            ...prev,
                            correctAnswerIndex: idx,
                            }))
                        }
                        className="accent-purple-500"
                        />

                        <input
                        value={opt}
                        disabled={isViewMode}
                        onChange={(e) =>
                            handleOptionChange(idx, e.target.value)
                        }
                        className={`flex-1 rounded-lg border px-4 py-2 ${
                            isViewMode ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                        />

                    </div>
                    ))}

                    <p className="text-xs text-gray-500">
                    {isViewMode?"The selected option is the correct one":'Select the correct option using the radio button'}
                    </p>
                </div>
                )}



          {/* Submit */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-6 py-2"
            >
              Close
            </button>
           {!isViewMode && (
                <button
                disabled={submitting}
                className="rounded-lg bg-purple-500 px-6 py-2 text-white disabled:opacity-50"
                >
                {submitting ? "Saving..." : "Save Changes"}
                </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditQuestionModal;
