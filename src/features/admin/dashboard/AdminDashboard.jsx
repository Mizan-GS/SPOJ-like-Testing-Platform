import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import OverviewCard from "./OverviewCards";
import { useMemo } from "react";

import {
  Users,
  FileText,
  ClipboardList,
  BarChart3,
  BadgePercent,
  SquareEqual,
} from "lucide-react";
import {
  getAdminOverviewAnalytics,
  getTestAnalytics,
  getUserAnalytics,
} from "../../../services/admin.api";
import UsersListModal from "./modals/UsersListModal";
import TestsListModal from "./modals/TestsListModal";
import AssessmentsListModal from "./modals/AssessmentsListModal";
import { getAllQuestions } from "../../../services/admin.api";
import QuestionsByCategoryChart from "./charts/QuestionsByCategoryChart";
import QuestionsByDifficultyChart from "./charts/QuestionsByDifficultyChart";
import QuestionsAnalyticsTabs from "./charts/QuestionAnalyticsTabs";
import TopTestsChart from "./charts/TopTestsChart";
// import { set } from "react-hook-form";
/* ------------------------------------
   REUSABLE STAT CARD
------------------------------------ */
function StatCard({ label, value ,onClick}) {
  return (
    <div  onClick={onClick}
    className="min-w-[220px] flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition cursor-pointer" >
      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-semibold text-purple-600">
        <AnimatedNumber value={value} />
      </p>
    </div>
  );
}

function AnimatedNumber({value,duration =800}){
  const [displayValue,setDisplayValue] = useState(0);

  useEffect(()=>{
    let start = 0;
    const end = Number(value)||0;
    
    if (start===end) {
      return;
    }
    const increment = Math.max(1,Math.floor(end/(duration/16)));
    
    const timer = setInterval(()=>{
      start+=increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setDisplayValue(start)
    },30)

    return()=> clearInterval(timer);
  },[value,duration])
  return <>{displayValue}</>;
}


function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  // const [testAnalytics, setTestAnalytics] = useState([]);
  // const [userAnalytics, setUserAnalytics] = useState([]);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showTestsModal, setShowTestsModal] = useState(false);
  const [showAssessmentsModal, setShowAssessmentsModal] = useState(false);
  const [questions,setQuestions]=useState([])
  const [testAnalytics, setTestAnalytics] = useState([]);

  const categoryChartData=React.useMemo(()=>{
    const map={};

    questions.forEach((q)=>{
      map[q.category] = (map[q.category] || 0)+1;
    })
    return Object.entries(map).map(
      ([category,value])=>({
        category,
        value,
      })
    );
  },[questions])


  const difficultyChartData=useMemo(()=>{
    const map={};
    questions.forEach((q)=>{
      map[q.difficulty] = (map[q.difficulty] || 0)+1;
    });

    return Object.entries(map).map(([key,value])=>({
      category:key,
      value,
    }))
  })

  const top5Tests = useMemo(()=>{
    return[...testAnalytics]
      .sort((a,b)=>b.totalAttempts-a.totalAttempts)
      .slice(0,5)
      .map((t)=>({
        title:t.title,
        totalAttempts:t.totalAttempts
      }))
  },[testAnalytics])


//   // const ITEMS_PER_PAGE = 10;

// // Test analytics pagination
//   const [testPage, setTestPage] = useState(1);

//   // User analytics pagination
//   const [userPage, setUserPage] = useState(1);


  const [loading, setLoading] = useState(true);

//   // Page size controls
// const [testPageSize, setTestPageSize] = useState(5);
// const [userPageSize, setUserPageSize] = useState(5);


//   // ---------------- TEST PAGINATION ----------------
//  const totalTestPages = Math.ceil(
//   testAnalytics.length / testPageSize
// );

// const paginatedTests = testAnalytics.slice(
//   (testPage - 1) * testPageSize,
//   testPage * testPageSize
// );


//   // ---------------- USER PAGINATION ----------------
// const totalUserPages = Math.ceil(
//   userAnalytics.length / userPageSize
// );

// const paginatedUsers = userAnalytics.slice(
//   (userPage - 1) * userPageSize,
//   userPage * userPageSize
// );



  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [overviewRes, testRes, userRes] = await Promise.all([
          getAdminOverviewAnalytics(),
          getTestAnalytics(),
          getUserAnalytics(),

        ]);
        const questionsRes = await getAllQuestions();
        setQuestions(questionsRes.data.data.questions || []);

        console.log(overviewRes.data.data);
        console.log(userRes.data.data);
        console.log(testRes.data.data);
        setTestAnalytics(testRes.data.data || [])

        setOverview(overviewRes.data.data);
        // setTestAnalytics(testRes.data.data || []);
        // setUserAnalytics(userRes.data.data || []);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Failed to load dashboard analytics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading dashboard...</div>;
  }

  if (!overview) {
    return (
      <div className="text-red-500">
        Unable to load dashboard data.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* ------------------------------------
          PAGE HEADER
      ------------------------------------ */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Dashboard Overview
        </h1>
        <p className="text-md text-gray-500">
          System-wide analytics summary
        </p>
      </div>

      {/* ------------------------------------
          OVERVIEW STATS
      ------------------------------------ */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Overview
        </h2>

        <div className="flex gap-6 overflow-x-auto pb-2">
          <OverviewCard
            icon={Users}
            label="Total Users"
            value={overview.totalUsers}
            description="Registered platform users"
            onClick={() => setShowUsersModal(true)}
            color="purple"
          />
          <OverviewCard
            icon={FileText}
            label="Total Tests"
            value={overview.totalTests}
            onClick={() => setShowTestsModal(true)}
            description="Question bank size"
            color="red"
          />
          <OverviewCard
            icon={ClipboardList}
            label="Total Assessments"
            onClick={() => setShowAssessmentsModal(true)}
            value={overview.totalAssessments}
            description="Created assessments"
            color="green"
          />
          <OverviewCard
            icon={BadgePercent}
            label="Total Assessments Attempts"
            // onClick={() => setShowAssessmentsModal(true)}
            value={overview.assessmentAttempts}
            description="Attempts on assessments"
            color="yellow"
          />
          <OverviewCard
            icon={SquareEqual}
            label="Total Tests Attempts"
            // onClick={() => setShowAssessmentsModal(true)}
            value={overview.testAttempts}
            description="Attempts on tests"
            color="gray"
          />
         
        </div>
      </section>

      <section className=" m-10 grid 
    lg:grid-cols-2 md:grid-cols-1 
    gap-6
    auto-rows-fr
    items-stretch">
        {/* <QuestionsByCategoryChart data={categoryChartData}/>
        <QuestionsByDifficultyChart data={difficultyChartData}/> */}
        <QuestionsAnalyticsTabs
        categoryData={categoryChartData}
        difficultyData={difficultyChartData}/>

        <TopTestsChart data={top5Tests}/>
      </section>


      {showUsersModal && (
        <UsersListModal onClose={() => setShowUsersModal(false)} />
      )}

      {showTestsModal && (
        <TestsListModal
          onClose={() => setShowTestsModal(false)}
        />
      )}

      {showAssessmentsModal && (
        <AssessmentsListModal
          onClose={() => setShowAssessmentsModal(false)}
        />
      )}




    </div>
  );
}

export default AdminDashboard;
