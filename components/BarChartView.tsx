"use client";

import { BarChart, Bar, XAxis, YAxis } from "recharts";

type Props = { data: { brand: string; count: number }[] };

// Bar graph made with Recharts
export default function BarChartView({ data }: Props) {
  return (
    <BarChart width={500} height={300} data={data}>
      <XAxis dataKey="brand" />
      <YAxis allowDecimals={false} />
      <Bar dataKey="count" fill="#2563eb" />
    </BarChart>
  );
}