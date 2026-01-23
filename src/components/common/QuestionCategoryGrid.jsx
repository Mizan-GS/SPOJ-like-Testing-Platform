import { useNavigate } from "react-router-dom";
import React from "react";
const categories = [
  { key: "VERBAL", title: "Verbal Ability", color: "purple" },
  { key: "APTITUDE", title: "Aptitude", color: "indigo" },
  { key: "LOGICAL", title: "Logical Reasoning", color: "emerald" },
  { key: "CODING", title: "Coding", color: "rose" },
];

const QuestionCategoryGrid = ({ counts }) => {
  const navigate = useNavigate();

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {categories.map((cat) => (
        <div
          key={cat.key}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between"
        >
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {cat.title}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {counts[cat.key] || 0} Questions
            </p>
          </div>

          <button
            onClick={() =>
              navigate(`/dashboard/questions/${cat.key}`)
            }
            className="mt-6 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700"
          >
            View Questions
          </button>
        </div>
      ))}
    </div>
  );
};

export default QuestionCategoryGrid;
