"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// OPTIMISATION: the chart libraries are loaded only when needed (code splitting).
// They are downloaded as separate files, after the page itself has loaded.
const BarChartView = dynamic(() => import("@/components/BarChartView"), {
  ssr: false,
  loading: () => <p>Loading chart...</p>,
});

const LineChartView = dynamic(() => import("@/components/LineChartView"), {
  ssr: false,
  loading: () => <p>Loading chart...</p>,
});

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
      <BarChartView data={data} />

      <h2>Line graph (Chart.js)</h2>
      <LineChartView data={data} />
    </section>
  );
}