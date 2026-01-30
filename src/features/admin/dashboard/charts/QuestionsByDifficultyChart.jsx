import React, { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

/*
Expected data format:
[
  { category: "EASY", value: 12 },
  { category: "MEDIUM", value: 7 },
  { category: "HARD", value: 3 }
]
*/

function QuestionsByDifficultyChart({ data }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    /* ========= ROOT ========= */
    const root = am5.Root.new(chartRef.current);

    root.setThemes([am5themes_Animated.new(root)]);

    /* ========= CHART ========= */
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
     //    innerRadius: am5.percent(60),
      })
    );

    const colorMap = {
     EASY: am5.color(0x22c55e),    // green
     MEDIUM: am5.color(0xfacc15),  // yellow
     HARD: am5.color(0xef4444),    // red
     };

    
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
      })
    );

    series.slices.template.adapters.add("fill", (fill, target) => {
     const category = target.dataItem?.get("category");
     return colorMap[category] || fill;
     });

     series.slices.template.adapters.add("stroke", (stroke, target) => {
     const category = target.dataItem?.get("category");
     return colorMap[category] || stroke;
     });


    /* ========= DATA ========= */
    series.data.setAll(data);

    /* ========= LEGEND ========= */
//     const legend = chart.children.push(
//       am5.Legend.new(root, {
//         centerX: am5.percent(50),
//         x: am5.percent(50),
//         marginTop: 15,
//       })
//     );

//     legend.data.setAll(series.dataItems);

    /* ========= ANIMATION ========= */
    series.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [data]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Questions by Difficulty
      </h3>

      <div ref={chartRef} style={{ width: "100%", height: "300px" }} />
    </div>
  );
}

export default QuestionsByDifficultyChart;
