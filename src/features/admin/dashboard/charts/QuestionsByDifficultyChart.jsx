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

function QuestionsByDifficultyChart({ data, resolvedTheme }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    /* ===============================
       READ THEME COLORS FROM CSS
    =============================== */
    const styles = getComputedStyle(document.documentElement);

    const bgColor = styles.getPropertyValue("--color-bg").trim();
    const textColor = styles.getPropertyValue("--color-text").trim();
    const borderColor = styles.getPropertyValue("--color-border").trim();

    /* ========= ROOT ========= */
    const root = am5.Root.new(chartRef.current);

    root.setThemes([am5themes_Animated.new(root)]);

    /* ========= CHART ========= */
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
      })
    );

    /* ========= SERIES ========= */
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
      })
    );

    /* ===============================
       SEMANTIC COLORS (UNCHANGED)
    =============================== */
    const colorMap = {
      EASY: am5.color(0x22c55e),    // green
      MEDIUM: am5.color(0xfacc15),  // yellow
      HARD: am5.color(0xef4444),    // red
    };

    series.slices.template.adapters.add("fill", (fill, target) => {
      const category = target.dataItem?.get("category");
      return colorMap[category] || fill;
    });

    series.slices.template.adapters.add("stroke", (stroke, target) => {
      const category = target.dataItem?.get("category");
      return colorMap[category] || stroke;
    });

    /* ========= LABEL STYLING ========= */
    series.labels.template.setAll({
      fill: am5.color(textColor),
      fontSize: 13,
    });

    series.ticks.template.setAll({
      stroke: am5.color(borderColor),
    });

    /* ========= DATA ========= */
    series.data.setAll(data);

    /* ========= ANIMATION ========= */
    series.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [data, resolvedTheme]); // 👈 IMPORTANT

  return (
    <div className="rounded-xl border border-border bg-bg p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-text">
        Questions by Difficulty
      </h3>

      <div ref={chartRef} className="h-[300px] w-full" />
    </div>
  );
}

export default QuestionsByDifficultyChart;
