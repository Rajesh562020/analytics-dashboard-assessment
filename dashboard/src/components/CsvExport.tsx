"use client";
import type { EvRow } from "../types/ev";
export default function CsvExport({ rows }: { rows: EvRow[] }) {
  const download = () => {
    if (!rows?.length) return;
    type Header = keyof EvRow;
    const headers = Object.keys(rows[0]) as Header[];
    const csv = [
      headers.join(","),
      ...rows.map(r => headers.map(h => `"${String(r[h] ?? "")}"`).join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ev_filtered.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return <button onClick={download} className="px-4 py-2 bg-blue-600 text-white rounded">Export CSV</button>;
}
