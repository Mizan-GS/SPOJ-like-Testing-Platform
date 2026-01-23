import React from "react";
const Pagination = () => {
  return (
    <div className="flex justify-between items-center mt-8">
      {/* <span className="text-gray-500">Showing 1–3 of 5 assessments</span> */}

      <div className="flex gap-2">
        <button className="px-3 py-1 border rounded">Prev</button>
        <button className="px-3 py-1 bg-purple-700 text-white rounded">1</button>
        <button className="px-3 py-1 border rounded">2</button>
        <button className="px-3 py-1 border rounded">3</button>
        <button className="px-3 py-1 border rounded">Next</button>
      </div>
    </div>
  );
};

export default Pagination;
