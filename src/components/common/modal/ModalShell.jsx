import React from "react";
import { X } from "lucide-react";

function ModalShell({
  title,
  onClose,
  children,
  width = "max-w-5xl",
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* ================= BACKDROP ================= */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* ================= MODAL ================= */}
      <div
        className={`relative z-10 w-full ${width} max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-xl`}
      >
        {/* ---------- HEADER ---------- */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* ---------- BODY ---------- */}
        <div className="overflow-y-auto px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default ModalShell;
