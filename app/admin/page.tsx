"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis } from "recharts"; // library 1
import "chart.js/auto";                                 // library 2
import { Line } from "react-chartjs-2";

export default function AdminPage() {
  const [data, setData] = useState<{ brand: string; count: number }[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((products) => {
        // count laptops per brand
        const counts: Record<string, number> = {};
        products.forEach((p: any) => {
          counts[p.brand] = (counts[p.brand] || 0) + 1;
        });
        setData(Object.keys(counts).map((brand) => ({ brand, count: counts[brand] })));
      });
  }, []);

  return (
    <section className="page">
      <h1>Admin</h1>

      <h2>Bar graph (Recharts)</h2>
      <BarChart width={500} height={300} data={data}>
        <XAxis dataKey="brand" />
        <YAxis />
        <Bar dataKey="count" fill="#2563eb" />
      </BarChart>

      <h2>Line graph (Chart.js)</h2>
      <Line
        data={{
          labels: data.map((d) => d.brand),
          datasets: [{ label: "Laptops in stock", data: data.map((d) => d.count) }],
        }}
      />
    </section>
  );
}