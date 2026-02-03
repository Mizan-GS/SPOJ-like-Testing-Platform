import React, { useState } from "react";
import ByTestAttempts from "../components/ByTestAttempts";
import ByUserAttempts from "../components/ByUserAttempts";
function TestAttemptsModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("tests");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-6xl rounded-2xl bg-bg p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-xl font-semibold text-text">
            Test Attempts Analytics
          </h2>
          <button onClick={onClose} className="text-text text-lg">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setActiveTab("tests")}
            className={`rounded-lg px-4 py-2 text-sm ${
              activeTab === "tests"
                ? "bg-secondary text-primary"
                : "border text-text"
            }`}
          >
            By Tests
          </button>

          <button
            onClick={() => setActiveTab("users")}
           className={`rounded-lg px-4 py-2 text-sm ${
              activeTab === "users"
                ? "bg-secondary text-primary"
                : "border text-text"
            }`}
          >
            By Users 
          </button>
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === "tests" && <ByTestAttempts />}
          {activeTab === "users" && <ByUserAttempts />}
        </div>
      </div>
    </div>
  );
}

export default TestAttemptsModal;
