"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function RangeHistogram({ data }: { data: Array<{ label:string, count:number }> }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow h-64">
      <h3 className="font-semibold mb-2">Electric Range Distribution</h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data}>
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" name="Vehicles" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
