import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getTestAnalytics } from "../../../../services/admin.api";
import ModalShell from "../../../../components/common/modal/ModalShell";

const PAGE_SIZE = 8;

function TestsListModal({ onClose }) {
  /* =========================
     STATE
  ========================= */
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  /* =========================
     FETCH TESTS
  ========================= */
  const fetchTests = async () => {
    try {
      setLoading(true);
      const res = await getTestAnalytics();
      setTests(res.data.data || []);
      console.log(res.data.data);
      
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to load tests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  /* =========================
     PAGINATION (FRONTEND)
  ========================= */
  const totalPages = Math.ceil(tests.length / PAGE_SIZE);

  const paginatedTests = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return tests.slice(start, end);
  }, [tests, page]);

  /* =========================
     UI
  ========================= */
  return (
    <ModalShell title="All Tests" onClose={onClose} width="max-w-5xl">
      {/* LOADING */}
      {loading && (
        <p className="text-center text-sm text-gray-500">
          Loading tests...
        </p>
      )}

      {!loading && (
        <>
          {/* TABLE */}
          <div className="overflow-hidden rounded-xl border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">
                    Title
                  </th>
                  <th className="px-6 py-4 text-center font-medium">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-center font-medium">
                    Questions
                  </th>
                  <th className="px-6 py-4 text-center font-medium">
                    Attempts
                  </th>
                  <th className="px-6 py-4 text-center font-medium">
                    Created At
                  </th>
                  <th className="px-6 py-4 text-center font-medium">
                    Avg Score
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedTests.map((test, idx) => (
                  <tr
                    key={test.testId}
                    className={`border-t ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {test.title}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {test.duration ?? "-"} min
                    </td>

                    <td className="px-6 py-4 text-center">
                      {test.totalQuestions ?? "-"}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {test.totalTestAttempts}
                    </td>

                    <td className="px-6 py-4 text-center text-gray-600">
                      {test.createdAt
                        ? new Date(test.createdAt).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                        {test.averageScore}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
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

export default TestsListModal;
