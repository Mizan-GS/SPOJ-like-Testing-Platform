import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { languageConfig } from "../../utils/languageConfig";
import CodeEditor from "../../editor/CodeEditor";
//import { runAllTestcases } from "../../utils/testcase-management";
import { toast } from "react-toastify";

const TestEditor = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTestCaseIndex, setActiveTestCaseIndex] = useState(0);

  const [language, setLanguage] = useState("javascript");
  const [codeMap, setCodeMap] = useState({});
  const [outPutMap, setOutputMap] = useState({});

  // const [timeLeft, setTimeLeft] = useState(0); 
  // const timerRef = useRef(null);

  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(true);

  const activeQuestion = useMemo(
    () => questions?.[activeIndex],
    [questions, activeIndex]
  );

  /*
  const formattedTimer = useMemo(() => {
    const min = Math.floor(timeLeft / 60);
    const sec = (timeLeft % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  }, [timeLeft]);
  */
  const initCodeForQuestions = useCallback((qs, lang) => {
    const boiler =
      languageConfig?.[lang]?.boilerplate ||
      languageConfig?.javascript?.boilerplate ||
      "";

    const initial = {};
    qs.forEach((q) => {
      initial[q._id] = boiler;
    });

    setCodeMap(initial);
  }, []);

  // const startTimer = useCallback(
  //   (initialSeconds) => {
  //     if (timerRef.current) clearInterval(timerRef.current);

  //     setTimeLeft(initialSeconds);

  //     timerRef.current = setInterval(() => {
  //       setTimeLeft((prev) => {
  //         if (prev <= 1) {
  //           clearInterval(timerRef.current);
  //           return 0;
  //         }
  //         return prev - 1;
  //       });
  //     }, 1000);
  //   },
  //   [timerRef]
  // );

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/attempt/user/${attemptId}/questions`);
      const payload = res.data?.data;

      const qs = payload?.questions || [];
      //const endTime = payload?.endTime;

      if (!qs.length) {
        setQuestions([]);
        setLoading(false);
        return;
      }

      setQuestions(qs);
      setActiveIndex(0);
      setActiveTestCaseIndex(0);
  
      initCodeForQuestions(qs, "javascript");

      
      //const remainingMs = new Date(endTime).getTime() - Date.now();
      //const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));
     // startTimer(remainingSeconds);
    } catch {
      alert("Test expired or invalid attempt");
      navigate("/user/tests", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [attemptId, initCodeForQuestions, navigate]);
  // }, [attemptId, initCodeForQuestions, navigate, startTimer]);    timer required when strat timer as per test

  useEffect(() => {
    fetchQuestions();
    // return () => {
    //   if (timerRef.current) clearInterval(timerRef.current);
    // };
  }, [fetchQuestions]);
  
  /*
  useEffect(() => {
    if (timeLeft === 0 && questions.length > 0) {
     
      (async () => {
        try {
          await api.post(`/attempt/${attemptId}/submit`);
          alert("⏱ Time Over! Test auto-submitted.");
        } catch (e) {
          console.error("Auto submit failed:", e);
        } finally {
          navigate("/user/tests", { replace: true });
        }
      })();
    }
  }, [timeLeft, attemptId, navigate, questions.length]);
  */
  const updateCode = useCallback(
    (val) => {
      if (!activeQuestion?._id) return;
      setCodeMap((prev) => ({
        ...prev,
        [activeQuestion._id]: val,
      }));
    },
    [activeQuestion?._id]
  );

  /*

  const handleRun = useCallback(async () => {
  if (!activeQuestion?._id) return;

  try {
    setRunning(true);
    setError("");

    const res = await api.post("/sandbox/run", {
      questionId: activeQuestion._id,
      code: codeMap?.[activeQuestion._id] || "",
      language,
    });

    const { summary, results } = res.data;

    setOutputMap((prev) => ({
      ...prev,
      [activeQuestion._id]: {
        total: summary.totalTCs,
        passed: summary.passedTCs,
        failed: summary.totalTCs - summary.passedTCs,
        code: codeMap?.[activeQuestion._id] || "",
        results,   
      },
    }));

  } catch (err) {
    setError(err.response?.data?.message || "Execution failed");
  } finally {
    setRunning(false);
  }
}, [activeQuestion?._id, codeMap, language]);
*/



const handleRun = useCallback(async () => {
  if (!activeQuestion?._id) return;

  try {
    setRunning(true);
    setError("");

    const res = await api.post("/sandbox/run", {
      questionId: activeQuestion._id,
      code: codeMap?.[activeQuestion._id] || "",
      language,
    });


    const data = res.data;
    console.log(data)

    const summary = data.summary || {
      totalTCs: data.totalTCs,
      passedTCs: data.passedTCs,
    };

    const results = data.results || [];

    setOutputMap((prev) => ({
      ...prev,
      [activeQuestion._id]: {
        total: summary.totalTCs,
        passed: summary.passedTCs,
        failed: summary.totalTCs - summary.passedTCs,
        code: codeMap?.[activeQuestion._id] || "",
        results,
      },
    }));
  } catch (err) {
    setError(err.response?.data?.message || "Execution failed");
  } finally {
    setRunning(false);
  }
}, [activeQuestion?._id, codeMap, language]);





 const saveAnswer = useCallback(async () => {
  if (!activeQuestion?._id) return;

  try {
    await api.post(
      `/attempt/user/${attemptId}/question/${activeQuestion._id}/save`,
      {
        //  questionId: activeQuestion._id,
        code: codeMap?.[activeQuestion._id] || "",
        language,
        passedTCs: outPutMap?.[activeQuestion._id]?.passed || 0,
        totalTCs: outPutMap?.[activeQuestion._id]?.total || 0,
      }
    );

    toast.success("✅ Answer saved");
  } catch (err) {
    toast.error(err.response?.data?.message || "❌ Failed to save answer");
  }
}, [activeQuestion?._id, attemptId, codeMap, language, outPutMap]);



  const submitTest = useCallback(async () => {
    if (!window.confirm("Submit test now?")) return;

    try {
      await api.post(`/attempt/user/${attemptId}/submit`);
      toast.success("✅ Test submitted successfully");
    } catch {
      toast.error("❌ Failed to submit test");
    } finally {
      navigate("/dashboard/user/tests", { replace: true });
    }
  }, [attemptId, navigate]);

 

  if (loading) {
    return <div className="text-white p-8">Loading Test...</div>;
  }

  if (!activeQuestion) {
    return (
      <div className="text-white p-8">No questions found in this attempt.</div>
    );
  }

  const testCases = activeQuestion?.testCases || [];
  const activeTestcase = testCases?.[activeTestCaseIndex];

  return (
    <div className="h-screen bg-black text-gray-300 flex">
     
      {/* <div className="fixed top-4 right-6 z-50 rounded-xl border border-white/10 bg-red-600/90 px-4 py-2 text-white font-semibold shadow-lg backdrop-blur">
        ⏱ {formattedTimer}
      </div> */}

     
      <div className="w-1/2 p-6 overflow-y-auto border-r border-gray-800">
    
        <div className="flex gap-2 mb-6 flex-wrap">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveIndex(i);
                setActiveTestCaseIndex(0);
                setError("");
              }}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition
                ${
                  i === activeIndex
                    ? "bg-emerald-500 text-black"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Q{i + 1}
            </button>
          ))}
        </div>

       
        <h1 className="text-xl font-bold mb-2 text-white">
          {activeQuestion.title}
        </h1>

        <div className="flex items-center gap-2 mb-4">
          <span
            className={`px-2 py-1 text-xs rounded-lg font-semibold ${
              activeQuestion.difficulty === "EASY"
                ? "bg-green-500/20 text-green-300"
                : activeQuestion.difficulty === "MEDIUM"
                ? "bg-yellow-500/20 text-yellow-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {activeQuestion.difficulty}
          </span>

          <div className="flex gap-2 flex-wrap">
            {(activeQuestion.tags || []).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs rounded-lg bg-gray-800 text-gray-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <p className="whitespace-pre-line mb-5 text-gray-200">
          {activeQuestion.description}
        </p>

        {!!activeQuestion.constraints?.length && (
          <div>
            <h2 className="font-semibold mb-2 text-white">Constraints</h2>
            <div className="bg-gray-900 p-4 rounded-xl text-sm space-y-1 border border-white/5">
              {activeQuestion.constraints.map((c, idx) => (
                <p key={idx} className="text-gray-300">
                  • {c}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

     
      <div className="w-1/2 flex flex-col border-l border-gray-800">
        <div className="flex-1">
          <CodeEditor
            code={codeMap?.[activeQuestion._id] || ""}
            setCode={updateCode}
            language={language}
            setLanguage={setLanguage}
          />
        </div>

        <div className="flex gap-3 px-4 py-3 border-t border-gray-800 bg-black">
          <button
            type="button"
            onClick={saveAnswer}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-500 transition"
          >
            Save
          </button>

          <button
            type="button"
            onClick={handleRun}
            disabled={running}
            className={`rounded-xl px-4 py-2 text-white font-semibold transition
              ${
                running
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500"
              }`}
          >
            {running ? "Running..." : "Run"}
          </button>

          <button
            type="button"
            onClick={submitTest}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-500 transition"
          >
            Submit
          </button>
        </div>

      
        {outPutMap[activeQuestion._id] && (
          <div className="m-4 p-3 rounded-xl bg-gray-900 border border-gray-700">
            <p
              className={`font-semibold ${
                outPutMap[activeQuestion._id].failed > 0
                  ? "text-red-400"
                  : "text-emerald-400"
              }`}
            >
              {outPutMap[activeQuestion._id].failed > 0 ? "❌" : "✅"} Passed{" "}
              {outPutMap[activeQuestion._id].passed} /{" "}
              {outPutMap[activeQuestion._id].total}
            </p>
            {outPutMap[activeQuestion._id].failed > 0 && (
              <p className="text-red-400 text-sm mt-1">
                Failed {outPutMap[activeQuestion._id].failed} testcases
              </p>
            )}
          </div>
        )}

        <div className="h-auto bg-gray-950 border-t border-gray-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-200">Testcases</h2>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>

          <div className="flex gap-2 mb-4 flex-wrap">
            {testCases.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveTestCaseIndex(i);
                }}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                  i === activeTestCaseIndex
                    ? "bg-emerald-500 text-black"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                Case {i + 1}
              </button>
            ))}
          </div>

          
          {activeTestcase ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Input</p>
                <pre className="bg-gray-900 p-3 rounded-xl text-sm text-gray-200 border border-white/5 whitespace-pre-wrap">
                  {String(activeTestcase.input)}
                </pre>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Expected Output</p>
                <pre className="bg-gray-900 p-3 rounded-xl text-sm text-gray-200 border border-white/5 whitespace-pre-wrap">
                  {typeof activeTestcase.output === "object"
                    ? JSON.stringify(activeTestcase.output, null, 2)
                    : String(activeTestcase.output)}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No testcases available.</p>
          )}

        </div>
      </div>
    </div>
  );
};

export default TestEditor;
