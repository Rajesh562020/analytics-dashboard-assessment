"use client";
import { useEffect, useState } from "react";
import type { EvRow, Filterss } from "../types/ev";

type FiltersProps = {
  rows: EvRow[];
  value: Filterss;
  onChange: (filters: Filterss) => void;
};

export default function Filters({
  rows,
  value,
  onChange
}: FiltersProps) {
  const makes = Array.from(new Set(rows.map(r => r.Make))).filter(Boolean).slice(0, 100);
  const [make, setMake] = useState("");
  const [type, setType] = useState<"ALL" | "BEV" | "PHEV">("ALL");
  const [yearMin, setYearMin] = useState<number|undefined>(undefined);
  const [yearMax, setYearMax] = useState<number|undefined>(undefined);

  useEffect(() => {
    if(!value) return;
    setMake(value.make ?? "");
    setType(value.type ?? "ALL");
    setYearMin(value.yearMin);
    setYearMax(value.yearMax);
  },[value?.make, value?.type, value?.yearMin, value?.yearMax])

  useEffect(() => {
    onChange({ make, type, yearMin, yearMax });
  }, [make, type, yearMin, yearMax]);

  // useEffect(() => {
  //   console.log("Year range changed:",{yearMin, yearMax})
  // },[yearMin, yearMax])

  // useEffect(() => {
  //   console.log("Filters:", { make, type, yearMin, yearMax });
  // }, [make, type, yearMin, yearMax]);

  return (
    <div className="p-4 bg-white rounded-lg shadow space-y-3">
      <h3 className="font-semibold">Filters</h3>

      <label className="block text-sm">Make</label>
      <select value={make} onChange={e => setMake(e.target.value)} className="w-full p-2 border rounded">
        <option value="">All</option>
        {makes.map(m => <option key={m} value={m}>{m}</option>)}
      </select>

      <label className="block text-sm">Type</label>
      <select value={type} onChange={e => setType(e.target.value as "ALL" | "BEV" | "PHEV")} className="w-full p-2 border rounded">
        <option value="ALL">All</option>
        <option value="BEV">BEV</option>
        <option value="PHEV">PHEV</option>
      </select>

      <label className="block text-sm">Year range (min / max)</label>
      <div className="flex gap-2">
        <input type="number" placeholder="min" className="p-2 border rounded w-1/2" value={yearMin ?? ""} onChange={e => setYearMin(e.target.value ? Number(e.target.value) : undefined)} />
        <input type="number" placeholder="max" className="p-2 border rounded w-1/2" value={yearMax ?? ""} onChange={e => setYearMax(e.target.value ? Number(e.target.value) : undefined)} />
      </div>
    </div>
  );
}
