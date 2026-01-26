import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getAllTests,
  deleteTest,
} from "../../../services/admin.api";

function TestList() {
  const navigate = useNavigate();

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTests = async () => {
    try {
      const res = await getAllTests();
      setTests(res.data.data || []);
      console.log(res.data.data);
      
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load tests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this test?")) return;

    try {
      await deleteTest(id);
      toast.success("Test deleted");
      fetchTests();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete test"
      );
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading tests…</div>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Tests
          </h1>
          <p className="text-sm text-gray-500">
            Manage all assessments tests
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/tests/create")}
          className="rounded-lg bg-purple-500 px-4 py-2 text-sm text-white hover:bg-purple-600"
        >
          + Create Test
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 text-left font-medium">
                Title
              </th>
              <th className="px-6 py-4 text-center font-medium">
                Duration (min)
              </th>
              <th className="px-6 py-4 text-center font-medium">
                Total Questions
              </th>
              <th className="px-6 py-4 text-right font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {tests.map((test) => (
              <tr
                key={test._id}
                className="border-t hover:bg-purple-50"
              >
                <td className="px-6 py-4 font-medium text-gray-800">
                  {test.title}
                </td>

                <td className="px-6 py-4 text-center text-gray-700">
                  {test.duration}
                </td>

                <td className="px-6 py-4 text-center text-gray-700">
                  {test.totalQuestions}
                </td>

                <td className="px-6 py-4 text-right space-x-3">
                  <button
                    onClick={() =>
                      navigate(`/admin/tests/${test._id}`)
                    }
                    className="text-sm text-gray-500 hover:underline"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleDelete(test._id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {tests.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No tests created yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TestList;
