import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";

const UserTestList = () => {
  const [tests, setTests] = useState([]);
  const [submittedTests, setSubmittedTests] = useState({});
  const navigate = useNavigate();
  const { id } = useParams(); // categoryId

  useEffect(() => {
    fetchTests();
    loadSubmittedStatus();
  }, [id]);

  const fetchTests = async () => {
    try {
      const res = await api.get(`tests/user/available`);
      setTests(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch tests");
    }
  };

  const loadSubmittedStatus = () => {
    const data = JSON.parse(sessionStorage.getItem("submittedTests")) || {};
    setSubmittedTests(data);
  };

  const isTestDone = (testId) => submittedTests[testId];

  const startTest = async (testId) => {
  try {
    const res = await api.post(`/attempt/user/${testId}/start`);

    const attemptId = res.data?.data?.attemptId;

    if (!attemptId) {
      console.error("Unexpected response:", res.data);
      throw new Error("Attempt ID not returned");
    }

    navigate(`/dashboard/user/test/start/${attemptId}`);
  } catch (err) {
    console.error(err);
    alert("Failed to start test");
  }
};


  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold mb-6 text-purple-800">
        Available Tests
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {tests.map((test) => {
          const done = isTestDone(test._id);

          return (
            <div
              key={test._id}
              className="bg-white border border-purple-100 rounded-2xl p-6
                       shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-purple-800">
                  {test.title}
                </h2>

                <p className="text-sm text-gray-600 mt-2">{test.description}</p>

                <div className="text-sm text-gray-500 mt-4 space-y-1">
                  <p>⏱ Duration: {test.duration} mins</p>
                  <p>📘 Min Attempt: {test.rules.minQuestionToAttempt}</p>
                  <p>🧪 Max Tab Switch: {test.rules.maxTabSwitch}</p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => startTest(test._id)}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold
                           hover:bg-purple-700 transition"
                >
                  Start Test
                </button>

                <button
                  disabled
                  className={`flex-1 py-2 rounded-lg font-semibold cursor-default
                  ${
                    done
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {done ? "✅ Done" : "⏳ Pending"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserTestList;
