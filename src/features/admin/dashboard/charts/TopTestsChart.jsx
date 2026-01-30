import React, { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

/*
Expected data:
[
  { title: "JavaScript Basics", totalAttempts: 42 },
  ...
]
*/

function TopTestsChart({ data }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // 1️⃣ Create root
    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);

    // 2️⃣ Create chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        layout: root.verticalLayout,
        panY: false,
        panX: false,
      })
    );

    // 3️⃣ Y Axis (Categories → test titles)
    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "title",
        renderer: am5xy.AxisRendererY.new(root, {
          inversed: true,
          minGridDistance: 20,
        }),
      })
    );

    // 4️⃣ X Axis (Values → attempts)
    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {}),
      })
    );

    // 5️⃣ Series
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        xAxis,
        yAxis,
        valueXField: "totalAttempts",
        categoryYField: "title",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{categoryY}: {valueX}",
        }),
      })
    );

    // 6️⃣ Styling
    series.columns.template.setAll({
      cornerRadiusTR: 8,
      cornerRadiusBR: 8,
      fill: am5.color(0x8b5cf6), // purple-500
      strokeOpacity: 0,
    });

    // 7️⃣ Data
    yAxis.data.setAll(data);
    series.data.setAll(data);

    // 8️⃣ Animate
    series.appear(1000);
    chart.appear(1000, 100);

    return () => root.dispose();
  }, [data]);

  return (
    <div className="rounded-xl border  bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Top 5 Tests by Attempts
      </h3>
      <div ref={chartRef} style={{ width: "100%", height: "300px" }} />
    </div>
  );
}

export default TopTestsChart;
