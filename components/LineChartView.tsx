"use client";

import "chart.js/auto";
import { Line } from "react-chartjs-2";

type Props = { data: { brand: string; count: number }[] };

// Line graph made with Chart.js
export default function LineChartView({ data }: Props) {
  return (
    <Line
      data={{
        labels: data.map((d) => d.brand),
        datasets: [{ label: "Laptops in stock", data: data.map((d) => d.count) }],
      }}
      options={{ scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }}
    />
  );
}