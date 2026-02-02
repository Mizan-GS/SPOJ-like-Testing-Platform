import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getAllAssessments } from "../../../../services/admin.api";
import ModalShell from "../../../../components/common/modal/ModalShell";

const PAGE_SIZE = 8;

function AssessmentsListModal({ onClose }) {
  /* =========================
     STATE
  ========================= */
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  /* =========================
     FETCH ASSESSMENTS
  ========================= */
  const fetchAssessments = async () => {
    try {
      setLoading(true);

      // Admin & backend-ready
      const res = await getAllAssessments({});
      console.log(res.data.data);
      
      setAssessments(res.data.data?.result || []);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to load assessments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  /* =========================
     PAGINATION
  ========================= */
  const totalPages = Math.ceil(
    assessments.length / PAGE_SIZE
  );

  const paginatedAssessments = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return assessments.slice(start, end);
  }, [assessments, page]);

  /* =========================
     UI
  ========================= */
  return (
    <ModalShell
      title="All Assessments"
      onClose={onClose}
      width="max-w-5xl"
    >
      {loading && (
        <p className="text-center text-sm text-gray-500">
          Loading assessments...
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
                  {/* <th className="px-6 py-4 text-center font-medium">
                    Type
                  </th> */}
                  <th className="px-6 py-4 text-center font-medium">
                    Sections
                  </th>
                  <th className="px-6 py-4 text-center font-medium">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-center font-medium">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center font-medium">
                    Created At
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedAssessments.map((a, idx) => (
                  <tr
                    key={a._id}
                    className={`border-t ${
                      idx % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {a.title}
                    </td>

                    {/* <td className="px-6 py-4 text-center">
                      {a.assessmentType}
                    </td> */}

                    <td className="px-6 py-4 text-center">
                      {a.sections?.length ?? 0}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {a.totalDuration} min
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          a.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {a.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center text-gray-600">
                      {a.createdAt
                        ? new Date(
                            a.createdAt
                          ).toLocaleDateString()
                        : "-"}
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
                onClick={() =>
                  setPage((p) => p - 1)
                }
                className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
              >
                Prev
              </button>

              <button
                disabled={page === totalPages}
                onClick={() =>
                  setPage((p) => p + 1)
                }
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

export default AssessmentsListModal;
