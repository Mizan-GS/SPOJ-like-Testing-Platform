import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAssessmentAttemptsByUser } from "../../../../services/admin.api";
import AttemptsTable from "./AssessmentAttemptsTable";
function AssessmentAccordion({ users, expandedId, onToggle }) {
  const [attemptsMap, setAttemptsMap] = useState({});
  const [loadingUserId, setLoadingUserId] = useState(null);
  const PAGE_SIZE = 10;
  const [pageMap, setPageMap] = useState({});

  const setPageForUser = (userId, page) => {
  setPageMap((prev) => ({
    ...prev,
    [userId]: page,
  }));
};

  const fetchAttempts = async (userId) => {
    if (attemptsMap[userId]) return; // ✅ cache

    try {
      setLoadingUserId(userId);
      const res = await getAssessmentAttemptsByUser(userId);
      setAttemptsMap((prev) => ({
        ...prev,
        [userId]: res.data.data || [],
      }));
    } catch {
      toast.error("Failed to load assessment attempts");
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleToggle = (userId) => {
    if (expandedId === userId) {
      onToggle(null);
    } else {
      onToggle(userId);
      fetchAttempts(userId);
    }
  };

  return (
    <div className="space-y-3">
      {users.map((user) => {
        const isOpen = expandedId === user.userId;
        const attempts = attemptsMap[user.userId] || [];
        const currentPage = pageMap[user.userId] || 1;

        const totalPages = Math.ceil(attempts.length / PAGE_SIZE);

        const paginatedAttempts = attempts.slice(
          (currentPage - 1) * PAGE_SIZE,
          currentPage * PAGE_SIZE
        );


        return (
          <div
            key={user.userId}
            className="rounded-xl border border-border bg-bg"
          >
            {/* HEADER */}
            <button
              onClick={() => handleToggle(user.userId)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <div>
                <p className="font-medium text-text">
                  {user.name}
                </p>
                <p className="text-sm text-text/60">
                  {user.email}
                </p>
              </div>

              <div className="flex gap-3 text-sm">
                <span className="rounded-full bg-secondary/20 px-3 py-1">
                  Attempts: {user.totalAssessmentAttempts}
                </span>
                <span className="rounded-full bg-secondary/20 px-3 py-1">
                  Avg: {user.averageScore}%
                </span>
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-blue-600">
                  {new Date(user.lastAttempt).toLocaleDateString()}
                </span>
              </div>
            </button>

            {/* BODY */}
            {isOpen && (
              <div className="border-t border-border px-5 py-4">
                {loadingUserId === user.userId ? (
                  <p className="text-sm text-text/60">
                    Loading attempts...
                  </p>
                ) : paginatedAttempts.length === 0 ? (
                  <p className="text-sm text-text/60">
                    No assessment attempts found
                  </p>
                ) : (
                  <>
                    <AttemptsTable attempts={paginatedAttempts} />

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                      <div className="mt-4 flex items-center justify-between text-sm">
                        <button
                          disabled={currentPage === 1}
                          onClick={() =>
                            setPageForUser(user.userId, currentPage - 1)
                          }
                          className="rounded-md border px-3 py-1 disabled:opacity-50"
                        >
                          Prev
                        </button>

                        <span className="text-text/70">
                          Page {currentPage} of {totalPages}
                        </span>

                        <button
                          disabled={currentPage === totalPages}
                          onClick={() =>
                            setPageForUser(user.userId, currentPage + 1)
                          }
                          className="rounded-md border px-3 py-1 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}

              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default AssessmentAccordion;
