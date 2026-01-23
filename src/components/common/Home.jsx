// import React, { useEffect, useState } from "react";
// import Navbar from "./Navbar";
// import Nav from "./Nav";

// const Home = () => {
 
     

//   return (
    
//     <div>
//        {/* <Navbar /> */}
//        <Nav />
//       <h1>Welcome to the Home Page</h1>
//     </div>
      
//   );
// };

// export default Home;



import React, { useState,useEffect} from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import AssessmentGrid from "./AssessmentGrid";
import Pagination from "./Pagination";
import QuestionCategoryGrid from "./QuestioncategoryGrid";
import api from "../../services/api";

export default function Home() {
  const location = useLocation();
  const [questionCounts, setQuestionCounts] = useState({});

  // 🔑 Hide home content if any child route is active
  const isChildRoute =
    location.pathname.includes("/dashboard/user/tests") ||
    location.pathname.includes("/dashboard/questions") ||
    location.pathname.includes("/dashboard/user/test/start");

  // Fetch question counts once
  useEffect(() => {
    fetchQuestionCounts();
  }, []);

  const fetchQuestionCounts = async () => {
    try {
      const res = await api.get("/questions");
      const questions = res.data.data.questions;

      const grouped = questions.reduce((acc, q) => {
        acc[q.category] = (acc[q.category] || 0) + 1;
        return acc;
      }, {});

      setQuestionCounts(grouped);
    } catch (err) {
      console.error("Failed to fetch questions");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-300 to-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!isChildRoute && (
          <>
            {/* ===== HEADER ===== */}
            <h1 className="text-3xl font-bold text-purple-800 mb-2">
              Welcome Back 👋
            </h1>

            <p className="text-gray-600 mb-10">
              Choose tests or practice questions
            </p>

         
            <section className="mb-14">
              <h2 className="text-2xl font-semibold text-purple-700 mb-6">
                Assessments
              </h2>

              <AssessmentGrid />
             
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-purple-700 mb-6">
                Question Bank
              </h2>

              <QuestionCategoryGrid counts={questionCounts} />
            </section>
          </>
        )}

        {/* 🔹 Child routes render here */}
        <Outlet />
      </main>
    </div>
  );
}
