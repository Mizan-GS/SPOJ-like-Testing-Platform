import React, { useState } from "react";
import QuestionsByCategoryChart from "./QuestionsByCategoryChart";
import QuestionsByDifficultyChart from "./QuestionsByDifficultyChart";

function QuestionsAnalyticsTabs({
  categoryData,
  difficultyData,
}) {
  const [activeTab, setActiveTab] = useState("category");

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      {/* ================= HEADER ================= */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Question Analytics
        </h3>

        {/* ================= TABS ================= */}
        <div className="flex rounded-lg border bg-gray-50 p-1">
          <button
            onClick={() => setActiveTab("category")}
            className={`px-4 py-1.5 text-sm rounded-md transition ${
              activeTab === "category"
                ? "bg-purple-500 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            By Category
          </button>

          <button
            onClick={() => setActiveTab("difficulty")}
            className={`px-4 py-1.5 text-sm rounded-md transition ${
              activeTab === "difficulty"
                ? "bg-purple-500 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            By Difficulty
          </button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      {activeTab === "category" && (
        <QuestionsByCategoryChart data={categoryData} />
      )}

      {activeTab === "difficulty" && (
        <QuestionsByDifficultyChart data={difficultyData} />
      )}
    </div>
  );
}

export default QuestionsAnalyticsTabs;
