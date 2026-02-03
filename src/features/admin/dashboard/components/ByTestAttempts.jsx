import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getTestAnalytics } from "../../../../services/admin.api";
import TestAccordionRow from "./TestAccordionRow";

function ByTestAttempts() {
  const [tests, setTests] = useState([]);
  const [expandedTestId, setExpandedTestId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await getTestAnalytics();
        setTests(res.data.data || []);
      } catch {
        toast.error("Failed to load tests");
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  if (loading) {
    return <p className="text-text">Loading tests...</p>;
  }

  return (
    <div className="space-y-3">
      {tests.map((test) => (
        <TestAccordionRow
          key={test.testId}
          test={test}
          isOpen={expandedTestId === test.testId}
          onToggle={() =>
            setExpandedTestId(
              expandedTestId === test.testId ? null : test.testId
            )
          }
        />
      ))}
    </div>
  );
}

export default ByTestAttempts;
