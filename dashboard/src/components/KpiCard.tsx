"use client";
export default function KpiCard({ title, value, suffix }: { title: string; value: string | number; suffix?: string }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold">{value}{suffix ?? ""}</div>
    </div>
  );
}
