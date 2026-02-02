import React, { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { getChartColors } from "../../../../hooks/utils/chartTheme";
import { useTheme } from "../../../../app/providers/ThemeProvider";

function QuestionsByCategoryChart({ data }) {
  const chartRef = useRef(null);
  const { theme } = useTheme();


  useEffect(() => {
    if (!data || data.length === 0) return;

    const { bg, text } = getChartColors();

    const root = am5.Root.new(chartRef.current);

    root.setThemes([am5themes_Animated.new(root)]);

    // Background
    root.container.set("background", am5.Rectangle.new(root, {
      fill: am5.color(bg),
      fillOpacity: 1,
    }));

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(60),
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
      })
    );

    // TEXT COLORS
    series.labels.template.setAll({
      fill: am5.color(text),
      fontSize: 12,
    });

    series.ticks.template.setAll({
      stroke: am5.color(text),
      strokeOpacity: 0.3,
    });

    // DATA
    series.data.setAll(data);

    // LEGEND
    // const legend = chart.children.push(
    //   am5.Legend.new(root, {
    //     centerX: am5.percent(50),
    //     x: am5.percent(50),
    //   })
    // );

    // legend.labels.template.setAll({
    //   fill: am5.color(text),
    // });

    // legend.valueLabels.template.setAll({
    //   fill: am5.color(text),
    // });

    // legend.data.setAll(series.dataItems);

    series.appear(800, 100);

    return () => root.dispose();
  }, [data,theme]);

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
      <h3 className="mb-3 text-lg font-semibold text-[var(--color-text)]">
        Questions by Category
      </h3>

      <div ref={chartRef} className="h-[300px] w-full" />
    </div>
  );
}

export default QuestionsByCategoryChart;
