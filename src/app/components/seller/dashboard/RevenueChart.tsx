"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

type RevenueChartProps = {
  data: { month: string; revenue: number }[];
};

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#f5e6d3"
        />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(value) => [
            `$${Number(value ?? 0).toFixed(2)}`,
            "Revenue",
          ]}
          contentStyle={{ borderRadius: "8px", border: "1px solid #f5e6d3" }}
        />
        <Bar dataKey="revenue" fill="#0d7377" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
