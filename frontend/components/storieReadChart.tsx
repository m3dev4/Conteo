// components/StoriesReadChart.tsx
"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type ChartData = {
  month: string;
  count: number;
};

const data: ChartData[] = [
  { month: "Jan", count: 30 },
  { month: "Feb", count: 45 },
  { month: "Mar", count: 60 },
  { month: "Apr", count: 80 },
  { month: "May", count: 100 },
  { month: "Jun", count: 120 },
  { month: "Jul", count: 140 },
  { month: "Aug", count: 160 },
  { month: "Sep", count: 180 },
  { month: "Oct", count: 200 },
  { month: "Nov", count: 220 },
  { month: "Dec", count: 250 },
];

const StoriesReadChart: React.FC = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-800 rounded-xl shadow-lg">
      <ResponsiveContainer
        width="75%"
        height={300}
        className="flex items-center justify-center"
      >
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
          <XAxis dataKey="month" tick={{ fill: "#fff" }} />
          <YAxis tick={{ fill: "#fff" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#333",
              borderRadius: "8px",
              border: "none",
            }}
            labelStyle={{ color: "#fff" }}
            itemStyle={{ color: "#fff" }}
          />
          <Legend wrapperStyle={{ color: "#fff" }} />
          <Bar
            dataKey="count"
            fill="#4f46e5"
            barSize={20}
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StoriesReadChart;
