import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  createAssessment,
  updateAssessment,
  getAssessmentById,
} from "../../../services/admin.api";

const CATEGORY_OPTIONS = ["CODING", "APTITUDE", "LOGICAL", "VERBAL"];
const QUESTION_TYPES = ["CODING", "MCQ"];

function AssessmentFormModal({
  mode , // "create" | "edit"
  assessmentId,
  onClose,
  onSuccess,
}) {
  const isEditMode = mode === "edit";

  /* =========================
     META STATE
  ========================= */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");

  /* =========================
     SECTIONS STATE
  ========================= */
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState({
    category: "",
    questionType: "",
    totalQuestions: 1,
    duration: 10,
  });

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);

  const usedCategories = sections.map((s) => s.category);
  const canAddMoreSections = sections.length < 4;

  /* =========================
     FETCH (EDIT MODE)
  ========================= */
  useEffect(() => {
    if (!isEditMode) return;

    const fetchAssessment = async () => {
      try {
        const res = await getAssessmentById(assessmentId);
        const a = res.data.data;

        setTitle(a.title);
        setDescription(a.description || "");
        setInstructions(a.instructions || "");
        setSections(a.sections || []);
      } catch {
        toast.error("Failed to load assessment");
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [isEditMode, assessmentId, onClose]);

  /* =========================
     SECTION SAVE
  ========================= */
  const handleSaveSection = () => {
    const { category, questionType, totalQuestions, duration } = activeSection;

    if (!category || !questionType) {
      toast.error("Category and Question Type are required");
      return;
    }

    if (usedCategories.includes(category)) {
      toast.error("Section category must be unique");
      return;
    }

    setSections((prev) => [...prev, activeSection]);

    setActiveSection({
      category: "",
      questionType: "",
      totalQuestions: 1,
      duration: 10,
    });
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async () => {
    // console.log("CREATE / EDIT SUBMIT CLICKED");
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (sections.length === 0) {
      toast.error("At least one section is required");
      return;
    }

    const payload = {
      title,
      description,
      instructions,
      sections,
    };
    console.log("ASSESSMENT PAYLOAD", payload);

    try {
      setSubmitting(true);

      if (isEditMode) {
        await updateAssessment(assessmentId, payload);
        console.log("EDIT PAYLOAD:", payload);
console.log("EDIT ID:", assessmentId);

        toast.success("Assessment updated");
      } else {
        await createAssessment(payload);
        toast.success("Assessment created");
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Operation failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  /* =========================
     UI
  ========================= */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-2xl font-semibold text-gray-800">
          {isEditMode ? "Edit Assessment" : "Create Assessment"}
        </h2>

        {/* ===== META ===== */}
        <div className="mt-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Assessment Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border px-4 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border px-4 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Instructions
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border px-4 py-2"
            />
          </div>
          <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Duration (minutes)
        </label>
        <input
          type="number"
          min={1}
          value={activeSection.duration}
          onChange={(e) =>
            setActiveSection((p) => ({
              ...p,
              duration: Number(e.target.value),
            }))
          }
          className="w-full rounded-lg border px-3 py-2 focus:border-purple-500 focus:outline-none"
        />
      </div>
        </div>

        {/* ===== SECTIONS ===== */}
        <div className="mt-8 space-y-4">
          <h3 className="font-semibold text-gray-800">
            Sections ({sections.length}/4)
          </h3>

          {sections.map((s, idx) => (
            <div
              key={idx}
              className="flex justify-between rounded-lg border bg-gray-50 px-4 py-3"
            >
              <span>{s.category}</span>
              <span className="text-sm text-gray-500">
                {s.totalQuestions} Q • {s.duration} min
              </span>
            </div>
          ))}

          {canAddMoreSections && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 space-y-6">
            <h4 className="text-md font-semibold text-gray-800">
              Add Section
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Category */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={activeSection.category}
                  onChange={(e) =>
                    setActiveSection((p) => ({
                      ...p,
                      category: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border px-3 py-2 focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Select category</option>
                  {CATEGORY_OPTIONS.map((c) => (
                    <option
                      key={c}
                      value={c}
                      disabled={usedCategories.includes(c)}
                    >
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Question Type */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Question Type
                </label>
                <select
                  value={activeSection.questionType}
                  onChange={(e) =>
                    setActiveSection((p) => ({
                      ...p,
                      questionType: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border px-3 py-2 focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Select type</option>
                  {QUESTION_TYPES.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
        </select>
      </div>

      {/* Total Questions */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Total Questions
        </label>
        <input
          type="number"
          min={1}
          value={activeSection.totalQuestions}
          onChange={(e) =>
            setActiveSection((p) => ({
              ...p,
              totalQuestions: Number(e.target.value),
            }))
          }
          className="w-full rounded-lg border px-3 py-2 focus:border-purple-500 focus:outline-none"
        />
      </div>

      {/* Duration */}
      {/* <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Duration (minutes)
        </label>
        <input
          type="number"
          min={1}
          value={activeSection.duration}
          onChange={(e) =>
            setActiveSection((p) => ({
              ...p,
              duration: Number(e.target.value),
            }))
          }
          className="w-full rounded-lg border px-3 py-2 focus:border-purple-500 focus:outline-none"
        />
      </div> */}
    </div>

    {/* ADD SECTION BUTTON */}
    <div className="flex justify-end">
      <button
        type="button"
        onClick={handleSaveSection}
        className="rounded-lg bg-purple-500 px-6 py-2 text-sm font-medium text-white hover:bg-purple-600"
      >
        Add Section
      </button>
    </div>
  </div>
)}

        </div>

        {/* ===== ACTIONS ===== */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-lg border px-6 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-lg bg-purple-500 px-6 py-2 text-white disabled:opacity-50"
          >
            {submitting
              ? "Saving..."
              : isEditMode
              ? "Save Changes"
              : "Create Assessment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssessmentFormModal;
