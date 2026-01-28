import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getAdminOverviewAnalytics,
  getTestAnalytics,
  getUserAnalytics,
} from "../../../services/admin.api";

/* ------------------------------------
   REUSABLE STAT CARD
------------------------------------ */
function StatCard({ label, value }) {
  return (
    <div className="min-w-[220px] flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition">
      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-semibold text-purple-600">
        {value}
      </p>
    </div>
  );
}


function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [testAnalytics, setTestAnalytics] = useState([]);
  const [userAnalytics, setUserAnalytics] = useState([]);

  // const ITEMS_PER_PAGE = 10;

// Test analytics pagination
  const [testPage, setTestPage] = useState(1);

  // User analytics pagination
  const [userPage, setUserPage] = useState(1);


  const [loading, setLoading] = useState(true);

  // Page size controls
const [testPageSize, setTestPageSize] = useState(5);
const [userPageSize, setUserPageSize] = useState(5);


  // ---------------- TEST PAGINATION ----------------
 const totalTestPages = Math.ceil(
  testAnalytics.length / testPageSize
);

const paginatedTests = testAnalytics.slice(
  (testPage - 1) * testPageSize,
  testPage * testPageSize
);


  // ---------------- USER PAGINATION ----------------
const totalUserPages = Math.ceil(
  userAnalytics.length / userPageSize
);

const paginatedUsers = userAnalytics.slice(
  (userPage - 1) * userPageSize,
  userPage * userPageSize
);



  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [overviewRes, testRes, userRes] = await Promise.all([
          getAdminOverviewAnalytics(),
          getTestAnalytics(),
          getUserAnalytics(),
        ]);

        console.log(userRes.data.data);
        console.log(testRes.data.data);
        

        setOverview(overviewRes.data.data);
        setTestAnalytics(testRes.data.data || []);
        setUserAnalytics(userRes.data.data || []);
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
          <StatCard label="Total Users" value={overview.totalUsers} />
          <StatCard label="Total Tests" value={overview.totalTests} />
          <StatCard label="Total Attempts" value={overview.totalAttempts} />
          <StatCard
            label="Submitted Attempts"
            value={overview.submittedAttempts}
          />
          <StatCard
            label="Average Score"
            value={`${overview.averageScore}%`}
          />
        </div>
      </section>


      {/* ------------------------------------
          TEST ANALYTICS
      ------------------------------------ */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Test Analytics
          </h2>
          <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Rows per page:</span>
          <select
            value={testPageSize}
            onChange={(e) => {
              setTestPageSize(Number(e.target.value));
              setTestPage(1);
            }}
            className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:border-purple-500 focus:outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          
        </div>
          
        </div>

        

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-4 text-left font-medium">
                  Test
                </th>
                <th className="px-6 py-4 text-center font-medium">
                  Attempts
                </th>
                <th className="px-6 py-4 text-center font-medium">
                  Avg Score
                </th>
                <th className="px-6 py-4 text-center font-medium">
                  Pass Rate
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedTests.map((test, idx) => (
                <tr
                  key={test.testId}
                  className={`border-t transition ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-purple-50`}
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {test.title}
                  </td>

                  <td className="px-6 py-4 text-center text-gray-700">
                    {test.totalAttempts}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                      {test.averageScore}%
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                      {test.passRate}
                    </span>
                  </td>
                </tr>
              ))}

              {testAnalytics.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No test analytics available yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm text-gray-500">
              Page {testPage} of {totalTestPages}
            </p>

            <div className="flex gap-2">
              <button
                disabled={testPage === 1}
                onClick={() => setTestPage((p) => p - 1)}
                className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
              >
                Prev
              </button>

              <button
                disabled={testPage === totalTestPages}
                onClick={() => setTestPage((p) => p + 1)}
                className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

                  </div>
      </section>


      {/* ------------------------------------
          USER ANALYTICS
      ------------------------------------ */}
      <section className="my-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            User Analytics
          </h2>
      
            

              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Rows per page:</span>
                <select
                  value={userPageSize}
                  onChange={(e) => {
                    setUserPageSize(Number(e.target.value));
                    setUserPage(1);
                  }}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:border-purple-500 focus:outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={25}>25</option>
                  <option value={30}>30</option>
                </select>
              </div>
            


        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-4 text-left font-medium">
                  User
                </th>
                <th className="px-6 py-4 text-left font-medium">
                  Email
                </th>
                <th className="px-6 py-4 text-center font-medium">
                  Attempts
                </th>
                <th className="px-6 py-4 text-center font-medium">
                  Avg Score
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.map((user, idx) => (
                <tr
                  key={user.userId}
                  className={`border-t transition ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-purple-50`}
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {user.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {user.email}
                  </td>

                  <td className="px-6 py-4 text-center text-gray-700">
                    {user.totalAttempts}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                      {user.averageScore}%
                    </span>
                  </td>
                </tr>
              ))}

              {userAnalytics.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No user analytics available yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm text-gray-500">
              Page {userPage} of {totalUserPages}
            </p>

            <div className="flex gap-2">
              <button
                disabled={userPage === 1}
                onClick={() => setUserPage((p) => p - 1)}
                className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
              >
                Prev
              </button>

              <button
                disabled={userPage === totalUserPages}
                onClick={() => setUserPage((p) => p + 1)}
                className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default AdminDashboard;
