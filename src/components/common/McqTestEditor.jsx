import React, { useState } from "react";
import api from "../../services/api";

const McqTestEditor = ({ questions = [] }) => {
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});

  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No MCQ questions available
      </p>
    );
  }

  const selectOption = (qid, option) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: option,
    }));
  };

  const checkAnswer = async (qid) => {
    try {
      const res = await api.post("/checkmcq", {
        questionId: qid,
        selectedOption: answers[qid],
      });

      setResults((prev) => ({
        ...prev,
        [qid]: res.data.data,
      }));
    } catch {
      alert("Failed to check answer");
    }
  };

  return (
    <div className="space-y-6">
      {questions.map((q, index) => (
        <div
          key={q._id}
          className="bg-white rounded-xl p-6 shadow border"
        >
          <h3 className="font-semibold mb-3">
            Q{index + 1}. {q.title}
          </h3>

          <div className="space-y-2">
            {q.options?.map((opt) => (
              <label
                key={opt}
                className={`block p-3 border rounded-lg cursor-pointer
                  ${
                    answers[q._id] === opt
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200"
                  }`}
              >
                <input
                  type="radio"
                  name={q._id}
                  hidden
                  checked={answers[q._id] === opt}
                  onChange={() => selectOption(q._id, opt)}
                />
                {opt}
              </label>
            ))}
          </div>

          <button
            onClick={() => checkAnswer(q._id)}
            disabled={!answers[q._id]}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Check Answer
          </button>

          {results[q._id] && (
            <div className="mt-4 text-sm">
              {results[q._id].isCorrect ? (
                <p className="text-green-600">
                  ✅ Correct (Score: {results[q._id].score})
                </p>
              ) : (
                <p className="text-red-600">
                  ❌ Wrong — Correct Answer:{" "}
                  <b>{results[q._id].correctAnswer}</b>
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default McqTestEditor;
