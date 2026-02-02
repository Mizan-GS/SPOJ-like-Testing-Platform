import React, { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useTheme } from "../../../../app/providers/ThemeProvider";
/*
Expected data:
[
  { title: "JavaScript Basics", totalAttempts: 42 },
  ...
]
*/

function TopTestsChart({ data }) {
  const chartRef = useRef(null);
  const { theme } = useTheme();
  useEffect(() => {
    if (!data || data.length === 0) return;

    am5.array.each(am5.registry.rootElements, (root) => {
      if (root.dom === chartRef.current) {
        root.dispose();
      }
    });
    // 1️⃣ Create root
    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);


      const styles = getComputedStyle(document.documentElement);
    const bgColor = styles.getPropertyValue("--color-bg").trim();
    const textColor = styles.getPropertyValue("--color-text").trim();
    const primaryColor = styles.getPropertyValue("--color-primary").trim();


    root.interfaceColors.setAll({
      text: am5.color(textColor),
      grid: am5.color(textColor),
    });
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
    yAxis.get("renderer").labels.template.setAll({
      fill: am5.color(textColor),
      fontSize: 12,
    });

    // 4️⃣ X Axis (Values → attempts)
    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {}),
      })
    );

    xAxis.get("renderer").labels.template.setAll({
      fill: am5.color(textColor),
      fontSize: 12,
    });

    // 5️⃣ Series
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        xAxis,
        yAxis,
        valueXField: "totalTestAttempts",
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
      fill: am5.color(textColor), // purple-500
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
    <div className="rounded-xl border border-border bg-bg p-6 shadow-sm">
      <h3 className="mb-10 text-lg font-semibold text-text">
        Top 5 Tests by Attempts
      </h3>
      <div ref={chartRef} className="mt-10" style={{ width: "100%", height: "340px" }} />
    </div>
  );
}

export default TopTestsChart;
