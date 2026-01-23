import { useNavigate } from "react-router-dom";
import React from 'react'


const AssessmentCard = ({ title, desc, icon, categoryId }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/dashboard/user/tests/${categoryId}`)}
      className="bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer p-6 flex flex-col items-center"
    >
      <div className="text-5xl mb-4">{icon}</div>

      <h2 className="text-xl font-semibold text-purple-700 mb-2">
        {title}
      </h2>

      <p className="text-gray-500 mb-6 text-center">{desc}</p>

      <button className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800">
        View Tests
      </button>
    </div>
  );
};

export default AssessmentCard;
