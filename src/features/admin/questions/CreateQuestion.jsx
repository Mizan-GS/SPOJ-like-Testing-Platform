import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TestCasesSection from "./TestCasesSection";
import { createQuestion } from "../../../services/admin.api";

const CATEGORY_OPTIONS = [
  "CODING",
  "APTITUDE",
  "LOGICAL",
  "VERBAL",
];

const DIFFICULTY_OPTIONS = ["EASY", "MEDIUM", "HARD"];

function CreateQuestion() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "CODING",
    questionType: "CODING",
    difficulty: "EASY",
    tags: "",
    constraints: "",
    options: ["", "", "", ""],
    correctAnswer: null,
    testCases: [
      { input: "", output: "", explanation: "" },
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
    setForm((prev) => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index),
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      
      category: form.category,
      questionType: form.questionType,
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

      payload.testCases = form.testCases
      .filter(tc => tc.input && tc.output)
      .map(tc => ({
        input: tc.input,
        output: tc.output,
        explanation: tc.explanation || "",
      }));

    }


    if (isMCQ) {
      const cleanedOptions = form.options.filter(Boolean);

        payload.options = cleanedOptions;
        payload.correctAnswer =
        cleanedOptions[form.correctAnswerIndex];

    }

    try {
      setSubmitting(true);
      await createQuestion(payload);
      toast.success("Question created successfully");
      navigate("/admin/questions");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create question"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Create Question
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Add a new question to the question bank
        </p>
      </div>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
      >
        {/* -------- BASIC INFO -------- */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border px-4 py-2 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border px-4 py-2"
            >
              {DIFFICULTY_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
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
              Question Type
            </label>
            <select
              name="questionType"
              value={form.questionType}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border px-4 py-2"
            >
              <option value="CODING">CODING</option>
              <option value="MCQ">MCQ</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Tags (comma separated)
          </label>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border px-4 py-2"
          />
        </div>

        {/* -------- CODING FIELDS -------- */}
        {isCoding && (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Constraints
            </label>
            <textarea
              name="constraints"
              value={form.constraints}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full rounded-lg border px-4 py-2"
            />
          </div>

          <TestCasesSection
            testCases={form.testCases}
            onChange={handleTestCaseChange}
            onAdd={addTestCase}
            onRemove={removeTestCase}
          />
        </div>
      )}


        {/* -------- MCQ FIELDS -------- */}
        {isMCQ && (
        <div className="space-y-6">
            <div className="space-y-4">
            <p className="text-sm font-medium text-gray-700">
                Options
            </p>

            {form.options.map((opt, idx) => (
                <div
                key={idx}
                className="flex items-center gap-3"
                >
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
                    onChange={(e) =>
                    handleOptionChange(idx, e.target.value)
                    }
                    placeholder={`Option ${idx + 1}`}
                    className="flex-1 rounded-lg border px-4 py-2 focus:border-purple-500 focus:outline-none"
                />
                </div>
            ))}

            <p className="text-xs text-gray-500">
                Select the correct option using the radio button
            </p>
            </div>
        </div>
        )}


        {/* -------- ACTIONS -------- */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/questions")}
            className="rounded-lg border px-6 py-2 text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-purple-500 px-6 py-2 text-sm font-medium text-white hover:bg-purple-600 disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Question"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateQuestion;
