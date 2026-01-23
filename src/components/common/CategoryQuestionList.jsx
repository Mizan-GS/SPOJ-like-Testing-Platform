import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const CategoryQuestionList = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, [category]);

  const fetchQuestions = async () => {
    const res = await api.get("/questions");
    const all = res.data.data.questions;

    const filtered = all.filter(
      (q) => q.category === category && q.questionType === "MCQ"
    );

    setQuestions(filtered);
  };

  const startMcqTest = async () => {
    try {
      const res = await api.post("/checkmcq", {
        category,
      });

      const attemptId = res.data?.data?.attemptId;
      if (!attemptId) throw new Error("Attempt ID missing");

      navigate(`/dashboard/mcq-test/${attemptId}`);
    } catch (err) {
      alert("Failed to start MCQ test");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-800">
          {category} Questions
        </h2>

        <button
          onClick={() => navigate(`/dashboard/mcq/${category}`)}
          className="bg-purple-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-purple-700"
        >
          Start Test
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {questions.map((q) => (
          <div
            key={q._id}
            className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm"
          >
            <h3 className="font-semibold text-gray-800">
              {q.title}
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Difficulty: <span className="font-medium">{q.difficulty}</span>
            </p>

            <div className="flex gap-2 mt-3 flex-wrap">
              {q.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryQuestionList;
