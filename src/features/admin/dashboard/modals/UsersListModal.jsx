import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getUserAnalytics } from "../../../../services/admin.api";
import ModalShell from "../../../../components/common/modal/ModalShell";

const PAGE_SIZE = 8; // 👈 adjust easily later

function UsersListModal({ onClose }) {
  /* =========================
     STATE
  ========================= */
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  /* =========================
     FETCH USERS
  ========================= */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUserAnalytics();
      setUsers(res.data.data || []);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* =========================
     PAGINATION (FRONTEND)
  ========================= */
  const totalPages = Math.ceil(users.length / PAGE_SIZE);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return users.slice(start, end);
  }, [users, page]);

  /* =========================
     UI
  ========================= */
  return (
    <ModalShell title="All Users" onClose={onClose} width="max-w-5xl">
      {/* LOADING */}
      {loading && (
        <p className="text-center text-sm text-gray-500">
          Loading users...
        </p>
      )}

      {/* TABLE */}
      {!loading && (
        <>
          <div className="overflow-hidden rounded-xl border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">
                    Name
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
                    className={`border-t ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {user.userName}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-black text-center">
                      {user.totalTestAttempts}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                        {user.averageScore}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION CONTROLS */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
              >
                Prev
              </button>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </ModalShell>
  );
}

export default UsersListModal;
