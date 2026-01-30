import React, { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

function QuestionsByCategoryChart({ data }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;


    const root = am5.Root.new(chartRef.current);


    root.setThemes([
      am5themes_Animated.new(root),
    ]);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
      })
    );


    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
      })
    );

  
    series.data.setAll(data);

    series.appear(1000, 100);

    /* =============================
       7️⃣ CLEANUP (IMPORTANT)
    ============================= */
    return () => {
      root.dispose();
    };
  }, [data]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm ">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Questions by Category
      </h3>

      <div
        ref={chartRef}
        style={{ width: "100%", height: "300px" }}
      />
    </div>
  );
}

export default QuestionsByCategoryChart;
