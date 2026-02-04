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
import { useTheme } from "../../../app/providers/ThemeProvider";
import TestAttemptsModal from "./modals/TestAttemptsModal";
import AssessmentAttemptsModal from "./modals/AssessmentAttemptsModal";
import LanguageUsageChart from "./charts/LanguageUsageChart";
import { getLanguageAnalytics } from "../../../services/admin.api";
import TestLeaderboardModal from "./modals/TestLeaderboardModal";
import LeaderboardTable from "./components/LeaderboardTable";
import { getTestAttemptsByTestId } from "../../../services/admin.api";
// import { useEffect, useState } from "react";
// import TestAttemptsModal from "./modals/TestAttemptsModal";
function useResolvedTheme() {
  const [resolvedTheme, setResolvedTheme] = useState(
    document.documentElement.classList.contains("dark")
      ? "dark"
      : "light"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark =
        document.documentElement.classList.contains("dark");
      setResolvedTheme(isDark ? "dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return resolvedTheme;
}

// import { set } from "react-hook-form";
/* ------------------------------------
   REUSABLE STAT CARD
------------------------------------ */
function StatCard({ label, value ,onClick}) {
  return (
    <div  onClick={onClick}
    className="min-w-[220px] flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 shadow-sm transition cursor-pointer" >
      <p className="text-sm font-medium  text-[var(--color-text)]/70">
        {label}
      </p>

      <p className="mt-2 text-3xl font-semibold text-[var(--color-text)]">
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
  const [users, setUsers] = useState([]);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showTestsModal, setShowTestsModal] = useState(false);
  const [showAssessmentsModal, setShowAssessmentsModal] = useState(false);
  const [questions,setQuestions]=useState([])
  const [testAnalytics, setTestAnalytics] = useState([]);
  const theme=useTheme()
  const resolvedTheme = useResolvedTheme();
  const [showTestAttemptsModal, setShowTestAttemptsModal] = useState(false);
  const [showAssessmentAttemptsModal, setShowAssessmentAttemptsModal] = useState(false);
  const [languageUsage, setLanguageUsage] = useState([]);
  // const [showTestAttemptsModal, setShowTestAttemptsModal] = useState(false);
  const [leaderboardTests, setLeaderboardTests] = useState([]);
  const [selectedLeaderboardTest, setSelectedLeaderboardTest] = useState("");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

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
      .sort((a,b)=>b.totalTestAttempts-a.totalTestAttempts)
      .slice(0,5)
      .map((t)=>({
        title:t.title,
        totalTestAttempts:t.totalTestAttempts
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
        const [overviewRes, testRes, userRes,languageRes] = await Promise.all([
          getAdminOverviewAnalytics(),
          getTestAnalytics(),
          getUserAnalytics(),
          getLanguageAnalytics()
        ]);

        const testsRes = await getTestAnalytics();
        setLeaderboardTests(testsRes.data.data || []);

        const questionsRes = await getAllQuestions();
        setQuestions(questionsRes.data.data.questions || []);
        setLanguageUsage(languageRes.data.data)
        console.log(overviewRes.data.data);
        console.log(userRes.data.data);
        console.log(testRes.data.data);
        setTestAnalytics(testRes.data.data)
        setUsers(userRes.data.data)
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


  

  useEffect(() => {
    if (!selectedLeaderboardTest) return;

    const fetchLeaderboard = async () => {
      try {
        setLeaderboardLoading(true);

        const res = await getTestAttemptsByTestId(
          selectedLeaderboardTest
        );

        const processed = res.data.data.map((a) => {
          const duration =
            new Date(a.endTime) - new Date(a.startTime);

          return {
            userName: a.user.userName,
            email: a.user.email,
            score: a.score,
            duration, // tie-breaker
          };
        });

        // score DESC, duration ASC
        processed.sort(
          (a, b) =>
            b.score - a.score || a.duration - b.duration
        );

        setLeaderboardData(processed);
      } catch (e) {
        toast.error("Failed to load leaderboard");
      } finally {
        setLeaderboardLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedLeaderboardTest]);

  // useEffect(()=>{
  //   fetchLeaderboard()
  // },[])


  if (loading) {
    return <div className="text-[var(--color-text)]">Loading dashboard...</div>;
  }

  if (!overview) {
    return (
      <div className="text-red-500 font-bold">
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
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">
          Dashboard Overview
        </h1>
       <p className="text-md text-[var(--color-text)]/70">
          System-wide analytics summary
        </p>
      </div>

      {/* ------------------------------------
          OVERVIEW STATS
      ------------------------------------ */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">
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
            icon={SquareEqual}
            label="Total Tests Attempts"
            onClick={() => setShowTestAttemptsModal(true)}
            value={overview.testAttempts}
            description="Attempts on tests"
            color="gray"
          />
          <OverviewCard
            icon={BadgePercent}
            label="Total Assessments Attempts"
            onClick={() => setShowAssessmentAttemptsModal(true)}
            value={overview.assessmentAttempts}
            description="Attempts on assessments"
            color="yellow"
          />
          
         
        </div>
      </section>

      <section className=" m-10 grid 
    lg:grid-cols-2 md:grid-cols-1 
    gap-6
    auto-rows-fr
    items-stretch
    text-[var(--color-text)]
    
    ">
        {/* <QuestionsByCategoryChart data={categoryChartData}/>
        <QuestionsByDifficultyChart data={difficultyChartData}/> */}
        <section className="space-y-4 rounded-xl border border-border bg-bg p-6">
          <h2 className="text-lg font-semibold text-text">
            Weekly Test Leaderboard
          </h2>

          {/* Test dropdown */}
          <select
            value={selectedLeaderboardTest}
            onChange={(e) =>
              setSelectedLeaderboardTest(e.target.value)
            }
            className="w-full rounded-lg border border-border bg-bg px-4 py-2 text-text"
          >
            <option value="">Select a test</option>
            {leaderboardTests.map((t) => (
              <option key={t.testId} value={t.testId}>
                {t.title}
              </option>
            ))}
          </select>

          {/* Content */}
          {leaderboardLoading && (
            <p className="text-text/60">Loading leaderboard…</p>
          )}

          {!leaderboardLoading &&
            leaderboardData.length > 0 && (
              <LeaderboardTable data={leaderboardData} />
            )}
        </section>
        

        <TopTestsChart
        key={`questions-tab-${resolvedTheme}`} 
        data={top5Tests}/>

        <LanguageUsageChart
        key={`language-usage-${resolvedTheme}`}
        data={languageUsage}/>

        <QuestionsAnalyticsTabs
         key={`questions-tabs-${resolvedTheme}`}
        categoryData={categoryChartData}
        difficultyData={difficultyChartData}
      />


      </section>


      {showUsersModal && (
        <UsersListModal onClose={() => setShowUsersModal(false)}
        data={users} />
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

      {showTestAttemptsModal && (
        <TestAttemptsModal
          onClose={() => setShowTestAttemptsModal(false)}
        />
      )}

      {showAssessmentAttemptsModal && (
        <AssessmentAttemptsModal
          onClose={() => setShowAssessmentAttemptsModal(false)}
        />
      )}

      {showTestAttemptsModal && (
        <TestAttemptsModal
          onClose={() => setShowTestAttemptsModal(false)}
        />
      )}



    </div>
  );
}

export default AdminDashboard;
