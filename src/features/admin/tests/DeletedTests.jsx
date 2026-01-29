import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getDeletedTests,
  restoreTest,
} from "../../../services/admin.api";
import { useNavigate } from "react-router-dom";

function DeletedTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  /* ----------------------------
     FETCH DELETED TESTS
  ----------------------------- */
  useEffect(() => {
    const fetchDeletedTests = async () => {
      try {
        const res = await getDeletedTests();
        setTests(res.data.data || []);
      } catch (err) {
        toast.error("Failed to load deleted tests");
      } finally {
        setLoading(false);
      }
    };

    fetchDeletedTests();
  }, []);

  /* ----------------------------
     RESTORE HANDLER
  ----------------------------- */
  const handleRestore = async (id) => {
    try {
      await restoreTest(id);
      toast.success("Test restored successfully");

      // remove restored test from bin list
      setTests((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      toast.error("Failed to restore test");
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading deleted tests...</div>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Deleted Tests
          </h1>
          <p className="text-sm text-gray-500">
            Restore previously deleted tests
          </p>
        </div>
        <button onClick={()=>navigate("../tests")}
          className="rounded-lg border px-4 h-10 text-md">Close</button>
      </div>
      {/* LIST */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {tests.map((test) => (
          <div
            key={test._id}
            className="flex items-center justify-between px-6 py-4 border-b last:border-b-0"
          >
            <div>
              <p className="font-medium text-gray-800">
                {test.title}
              </p>
              <p className="text-sm text-gray-500">
                Duration: {test.duration} mins
              </p>
            </div>

            <button
              onClick={() => handleRestore(test._id)}
              className="rounded-lg bg-purple-500 px-4 py-2 text-sm text-white hover:bg-purple-600"
            >
              Restore
            </button>
          </div>
        ))}

        {tests.length === 0 && (
          <div className="px-6 py-10 text-center text-gray-500">
            No deleted tests found
          </div>
        )}
      </div>
    </div>
  );
}

export default DeletedTests;
