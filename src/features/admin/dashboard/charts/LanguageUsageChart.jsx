import React, { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

function LanguageUsageBarChart({ data }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // 🔥 Dispose existing chart (important for theme toggle)
    am5.array.each(am5.registry.rootElements, (root) => {
      if (root.dom === chartRef.current) {
        root.dispose();
      }
    });

    // 1️⃣ Root
    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);

    // 2️⃣ Theme colors from CSS variables
    const styles = getComputedStyle(document.documentElement);
    const textColor = styles.getPropertyValue("--color-text").trim();
    const barColor = styles.getPropertyValue("--color-secondary").trim();

    root.interfaceColors.setAll({
      text: am5.color(textColor),
      grid: am5.color(textColor),
    });

    // 3️⃣ Chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        layout: root.verticalLayout,
      })
    );
    
    // 4️⃣ X Axis (Languages)
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "language",
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 30,
        }),
      })
    );

    xAxis.get("renderer").labels.template.setAll({
      fill: am5.color(textColor),
      fontSize: 12,
    });

    // 5️⃣ Y Axis (Usage count)
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    yAxis.get("renderer").labels.template.setAll({
      fill: am5.color(textColor),
      fontSize: 12,
    });

    // 6️⃣ Series
   // 6️⃣ Series
const series = chart.series.push(
  am5xy.ColumnSeries.new(root, {
    name: "Language Usage",
    xAxis,
    yAxis,
    valueYField: "count",
    categoryXField: "language",
    tooltip: am5.Tooltip.new(root, {
      labelText: "[bold]{categoryX}[/]\nUsed {valueY} times",
    }),
  })
);

series.columns.template.setAll({
  fill: am5.color(barColor),
  strokeOpacity: 0,
  cornerRadiusTL: 6,
  cornerRadiusTR: 6,
  tooltipY: am5.percent(10),
  interactive: true,
});

// ✅ ADD THIS
chart.set(
  "cursor",
  am5xy.XYCursor.new(root, {
    behavior: "none",
  })
);





    // 7️⃣ Data
    xAxis.data.setAll(data);
    series.data.setAll(data);

    // 8️⃣ Animate
    series.appear(800);
    chart.appear(800, 100);

    return () => root.dispose();
  }, [data]);

  return (
    <div className="rounded-xl border border-border bg-bg p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-text">
        Programming Language Usage
      </h3>
      <div ref={chartRef} style={{ width: "100%", height: "340px" }} />
    </div>
  );
}

export default LanguageUsageBarChart;
