import React, { useEffect, useState } from "react";
import { getTestAnalytics } from "../../../../services/admin.api";
import { buildWeeklyLeaderboard } from "../../../../hooks/utils/leaderboard";
import TopThreePodium from "../components/TopThreePodium";
import LeaderboardTable from "../components/LeaderboardTable";
function TestLeaderboardModal({ onClose }) {
  const [tests, setTests] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTestAnalytics().then(res => {
      setTests(res.data.data || []);
    });
  }, []);

  useEffect(() => {
     if (!selectedTestId) return;

     setLoading(true);

     fetch(`/analytics/admin/test-attempts/${selectedTestId}`, {
     headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
     },
     })
     .then(res => res.json())
     .then(json => {
          const leaderboardData = buildWeeklyLeaderboard(json.data || []);
          setLeaderboard(leaderboardData);
     })
     .finally(() => setLoading(false));
     }, [selectedTestId]);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-6xl rounded-2xl bg-bg p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-xl font-semibold text-text">
            Weekly Test Leaderboard
          </h2>
          <button onClick={onClose} className="text-text text-lg">
            ✕
          </button>
        </div>

        {/* Test selector */}
        <div className="mt-4">
          <select
            value={selectedTestId}
            onChange={(e) => setSelectedTestId(e.target.value)}
            className="rounded-lg border border-border bg-bg px-4 py-2 text-text"
          >
            <option value="">Select a test</option>
            {tests.map(t => (
              <option key={t.testId} value={t.testId}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        {/* CONTENT PLACEHOLDER */}
        <div className="mt-6 text-text/60">
          {loading && (
               <p className="text-text/60">Loading leaderboard...</p>
               )}

               {!loading && leaderboard.length === 0 && (
               <p className="text-text/60">
               No attempts in the last 7 days
               </p>
               )}

               {leaderboard.length > 0 && (
               <>
               <TopThreePodium leaderboard={leaderboard} />
               <LeaderboardTable leaderboard={leaderboard} />
               </>
               )}

        </div>
      </div>
    </div>
  );
}

export default TestLeaderboardModal;
