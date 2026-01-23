
import React from "react";
import AssessmentCard from "./AssessmentCard";


const assessments = [
  {
    title: "All Tests",
    desc: "Data Structures & Algorithms tests",
    icon: "🧠",
    categoryId: "dsa",
  },
  // {
  //   title: "Full Stack Tests",
  //   desc: "Frontend + Backend assessments",
  //   icon: "💻",
  //   categoryId: "fullstack",
  // },
  // {
  //   title: "General Practice",
  //   desc: "Mixed problem-solving tests",
  //   icon: "📘",
  //   categoryId: "general",
  // },
];

const AssessmentGrid = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {assessments.map((item, i) => (
        <AssessmentCard key={i} {...item} />
      ))}
    </section>
  );
};

export default AssessmentGrid;
