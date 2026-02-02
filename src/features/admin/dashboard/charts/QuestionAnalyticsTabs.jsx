import React, { useState } from "react";
import QuestionsByCategoryChart from "./QuestionsByCategoryChart";
import QuestionsByDifficultyChart from "./QuestionsByDifficultyChart";
import { useTheme } from "../../../../app/providers/ThemeProvider";

function QuestionsAnalyticsTabs({
  categoryData,
  difficultyData,
}) {
  const [activeTab, setActiveTab] = useState("category");

  // ✅ READ CURRENT THEME (light / dark)
  const { theme } = useTheme();

  return (
    <div className="rounded-xl border border-border bg-bg p-6 shadow-sm">
      {/* ================= HEADER ================= */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text">
          Question Analytics
        </h3>

        {/* ================= TABS ================= */}
        <div className="flex rounded-lg border border-border bg-bg p-1">
          <button
            onClick={() => setActiveTab("category")}
            className={`px-4 py-1.5 text-sm rounded-md transition
              ${
                activeTab === "category"
                  ? "bg-secondary text-primary"
                  : "text-text hover:bg-secondary/10"
              }`}
          >
            By Category
          </button>

          <button
            onClick={() => setActiveTab("difficulty")}
            className={`px-4 py-1.5 text-sm rounded-md transition
              ${
                activeTab === "difficulty"
                  ? "bg-secondary text-primary"
                  : "text-text hover:bg-secondary/10"
              }`}
          >
            By Difficulty
          </button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      {activeTab === "category" && (
        <QuestionsByCategoryChart
          data={categoryData}
          resolvedTheme={theme}
        />
      )}

      {activeTab === "difficulty" && (
        <QuestionsByDifficultyChart
          data={difficultyData}
          resolvedTheme={theme}
        />
      )}
    </div>
  );
}

export default QuestionsAnalyticsTabs;
