import React, { useState } from "react";
import { toast } from "react-toastify";
import TestCasesSection from "./TestCasesSection";
import { createQuestion } from "../../../services/admin.api";

const CATEGORY_OPTIONS = ["CODING", "APTITUDE", "LOGICAL", "VERBAL"];
const DIFFICULTY_OPTIONS = ["EASY", "MEDIUM", "HARD"];

function CreateQuestion({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: "",                       // 🔹 optional
    description: "",
    category: "CODING",
    questionType: "CODING",
    difficulty: "EASY",
    tags: "",
    constraints: "",                 // 🔹 string in UI
    options: ["", "", "", ""],
    correctAnswerIndex: null,        // ✅ REQUIRED for MCQ
    testCases: [
      { input: "", output: "", explanation: "" },
      { input: "", output: "", explanation: "" },
      { input: "", output: "", explanation: "" }, // ✅ minimum 3
    ],
  });

  const [submitting, setSubmitting] = useState(false);

  const isMCQ = form.questionType === "MCQ";
  const isCoding = form.questionType === "CODING";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const updated = [...form.options];
    updated[index] = value;
    setForm((prev) => ({ ...prev, options: updated }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...form.testCases];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, testCases: updated }));
  };

  const addTestCase = () => {
    setForm((prev) => ({
      ...prev,
      testCases: [
        ...prev.testCases,
        { input: "", output: "", explanation: "" },
      ],
    }));
  };

  const removeTestCase = (index) => {
    if (form.testCases.length <= 3) {
      toast.error("Minimum 3 test cases required");
      return;
    }

    setForm((prev) => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isMCQ && form.correctAnswerIndex === null) {
      toast.error("Select correct answer");
      return;
    }

    if (isCoding && form.testCases.length < 3) {
      toast.error("Minimum 3 test cases required");
      return;
    }

    const payload = {
      category: form.category,
      questionType: form.questionType,
      title: form.title || undefined, // ✅ optional
      description: form.description,
      difficulty: form.difficulty,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    // ✅ CODING
    if (isCoding) {
      payload.constraints = form.constraints
        ? form.constraints.split(" ").filter(Boolean) // 🔹 string → array
        : [];

      payload.testCases = form.testCases
      .filter(tc => tc.input && tc.output)
      .map(tc => ({
        input: tc.input
          .split(" ")                 // ✅ multi-line → array
          .map(line => line.trim())
          .filter(Boolean),
        output: tc.output,
        explanation: tc.explanation || "",
      }));

    }

    // ✅ MCQ
    if (isMCQ) {
      payload.options = form.options;
      payload.correctAnswer =
        form.options[form.correctAnswerIndex];
    }

    try {
      setSubmitting(true);
      await createQuestion(payload);
      toast.success("Question created successfully");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to create question"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-2xl font-semibold">Create Question</h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">

          {/* TITLE (OPTIONAL) */}
          <div>
            <label className="text-sm font-medium">Title (optional)</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium">Question</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={8}
              required
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          {/* CONSTRAINTS */}
          {isCoding && (
            <div>
              <label className="text-sm font-medium">
                Constraints (one per line)
              </label>
              <textarea
                name="constraints"
                value={form.constraints}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border px-4 py-2"
              />
            </div>
          )}

          {/* TEST CASES */}
          {isCoding && (
            <TestCasesSection
              testCases={form.testCases}
              onChange={handleTestCaseChange}
              onAdd={addTestCase}
              onRemove={removeTestCase}
            />
          )}

          {/* MCQ */}
          {isMCQ && (
            <div className="space-y-4">
              <p className="text-sm font-medium">Options</p>

              {form.options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="correctOption"
                    checked={form.correctAnswerIndex === idx}
                    onChange={() =>
                      setForm((p) => ({
                        ...p,
                        correctAnswerIndex: idx,
                      }))
                    }
                  />
                  <input
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(idx, e.target.value)
                    }
                    className="flex-1 rounded-lg border px-4 py-2"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-6 py-2"
            >
              Cancel
            </button>

            <button
              disabled={submitting}
              className="rounded-lg bg-purple-600 px-6 py-2 text-white"
            >
              {submitting ? "Creating..." : "Create Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateQuestion;
