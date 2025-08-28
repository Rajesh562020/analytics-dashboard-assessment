"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function TopMakesBar({ data }: { data: Array<{ make:string, bev:number, phev:number, total:number }> }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow h-80">
      <h3 className="font-semibold mb-2">Top Makes</h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data}>
          <XAxis dataKey="make" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="bev" stackId="a" name="BEV" fill="#2563eb" />
          <Bar dataKey="phev" stackId="a" name="PHEV" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
