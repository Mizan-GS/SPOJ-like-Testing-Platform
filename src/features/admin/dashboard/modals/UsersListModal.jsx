import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { getUserAnalytics } from "../../../../services/admin.api";

function UsersListModal({ onClose }) {
  /* =========================
     STATE
  ========================= */
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);

  /* =========================
     FETCH USERS
  ========================= */
  const fetchUsers = async () => {
  if (loading || !hasMore) return;

  try {
    setLoading(true);

    const res = await getUserAnalytics();

    const usersArray = res.data.data;

    setUsers((prev) => [...prev, ...usersArray]);

    // ❗ backend doesn't support pagination yet
    setHasMore(false);
  } catch (err) {
    toast.error(
      err?.response?.data?.message ||
        "Failed to load users"
    );
  } finally {
    setLoading(false);
  }
};

  /* =========================
     INITIAL LOAD
  ========================= */
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  /* =========================
     SCROLL HANDLER
  ========================= */
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || loading || !hasMore) return;

    if (
      el.scrollTop + el.clientHeight >=
      el.scrollHeight - 80
    ) {
      fetchUsers();
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative z-10 w-full max-w-3xl rounded-2xl bg-white shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            All Users
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* LIST */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="max-h-[70vh] overflow-y-auto p-6 space-y-4"
        >
          {users.map((user) => (
            <div
              key={user.userId}
              className="flex items-center justify-between rounded-xl border bg-gray-50 px-5 py-4"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {user.name}
                </p>
                <p className="text-sm text-gray-500">
                  {user.email}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Attempts:{" "}
                  <span className="font-medium">
                    {user.totalAttempts}
                  </span>
                </p>

                <span className="mt-1 inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                  Avg: {user.averageScore}%
                </span>
              </div>
            </div>
          ))}

          {/* LOADING */}
          {loading && (
            <p className="text-center text-sm text-gray-500">
              Loading more users...
            </p>
          )}

          {/* END */}
          {!hasMore && (
            <p className="text-center text-sm text-gray-400">
              No more users
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UsersListModal;
