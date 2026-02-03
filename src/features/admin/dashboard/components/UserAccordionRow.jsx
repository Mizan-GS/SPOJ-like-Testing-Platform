import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosClient from "../../../../services/axiosClient";
import UserAttemptsTable from "./UserAttemptsTable";

function UserAccordionRow({ user, isOpen, onToggle }) {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
  bestScore: null,
});

  useEffect(() => {
    if (!isOpen) return;

    const fetchAttempts = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(
          `/analytics/admin/user-test-attempt/${user.userId}`
        );
        setAttempts(res.data.data || []);
        const bestScore =
          res.data.data.length > 0
          ? Math.max(...res.data.data.map((a) => a.score))
          : null;

          setSummary({
          bestScore,
          });
          console.log(bestScore);
          
      } catch {
        toast.error("Failed to load user attempts");
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [isOpen, user.userId]);


    useEffect(() => {

    const fetchAttempts = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(
          `/analytics/admin/user-test-attempt/${user.userId}`
        );
        const bestScore =
          res.data.data.length > 0
          ? Math.max(...res.data.data.map((a) => a.score))
          : null;

          setSummary({
          bestScore,
          });
          console.log(bestScore);
          
      } catch {
        toast.error("Failed to load user attempts");
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  return (
    <div className="rounded-xl border border-border bg-bg">
      {/* HEADER */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div>
          <p className="font-medium text-text">
            {user.name}
          </p>
          <p className="text-sm text-text/60">
            {user.email} • Attempts: {user.totalTestAttempts}  <span className="rounded-full ml-1 bg-secondary/20 px-3 py-1 text-text">
      Avg: {user.averageScore}%
    </span> 

   {summary.bestScore !== null && (
      <span className="rounded-full bg-green-500/20 px-3 py-1 mx-2 text-green-600">
         Best: {summary.bestScore}%
      </span>
    )}
          </p>
        </div>

        <span className="text-text text-xl">
          {isOpen ? "−" : "+"}
        </span>
      </button>

      {/* CONTENT */}
      {isOpen && (
        <div className="px-4 pb-4">
          {loading ? (
            <p className="text-text/60">Loading attempts...</p>
          ) : attempts.length === 0 ? (
            <p className="text-text/60">No attempts found</p>
          ) : (
            <UserAttemptsTable attempts={attempts} />
          )}
        </div>
      )}
    </div>
  );
}

export default UserAccordionRow;
