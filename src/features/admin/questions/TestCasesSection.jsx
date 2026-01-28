import React from "react";

function TestCasesSection({
  testCases,
  onChange,
  onAdd,
  onRemove,
  readOnly = false,
  allowAdd = true,
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-700">
        Test Cases
      </p>

      {testCases.map((tc, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-gray-200 p-4 space-y-3 bg-gray-50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Input"
              value={tc.input}
              readOnly={readOnly}
              onChange={(e) =>
                onChange?.(idx, "input", e.target.value)
              }
              className={`rounded-lg border px-4 py-2 ${
                readOnly ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />

            <input
              placeholder="Output"
              value={tc.output}
              readOnly={readOnly}
              onChange={(e) =>
                onChange?.(idx, "output", e.target.value)
              }
              className={`rounded-lg border px-4 py-2 ${
                readOnly ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <textarea
            placeholder="Explanation (optional)"
            value={tc.explanation || ""}
            readOnly={readOnly}
            onChange={(e) =>
              onChange?.(idx, "explanation", e.target.value)
            }
            rows={2}
            className={`w-full rounded-lg border px-4 py-2 text-sm ${
              readOnly ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />

          {!readOnly && testCases.length > 1 && (
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="text-sm text-red-500 hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      ))}

      {!readOnly && allowAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="rounded-lg border border-dashed px-4 py-2 text-sm text-purple-600 hover:bg-purple-50"
        >
          + Add Test Case
        </button>
      )}
    </div>
  );
}

export default TestCasesSection;
