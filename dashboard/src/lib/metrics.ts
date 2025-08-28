import type { EvRow } from "../types/ev";

export function computeKPIs(rows: EvRow[]) {
  const total = rows.length;
  const bev = rows.filter(r => (r["Electric Vehicle Type"] || "").toLowerCase().includes("bev")).length;
  const phev = rows.filter(r => (r["Electric Vehicle Type"] || "").toLowerCase().includes("phev")).length;
  const validRanges = rows.map(r => r["Electric Range"] ?? 0).filter(n => n > 0).sort((a,b)=>a-b);
  const medianRange = validRanges.length ? validRanges[Math.floor(validRanges.length/2)] : 0;
  const uniqueMakes = new Set(rows.map(r => (r.Make || "").trim())).size;
  const cafvYes = rows.filter(r =>
    (r["Clean Alternative Fuel Vehicle (CAFV) Eligibility"] || "").toLowerCase().includes("eligible")
  ).length;

  return {
    total,
    bevPct: total ? (bev/total)*100 : 0,
    phevPct: total ? (phev/total)*100 : 0,
    medianRange,
    uniqueMakes,
    cafvShare: total ? (cafvYes/total)*100 : 0
  };
}

export function topMakes(rows: EvRow[], k = 10) {
  const map = new Map<string, { total:number; bev:number; phev:number }>();
  rows.forEach(r => {
    const make = (r.Make || "Unknown").trim();
    const cur = map.get(make) ?? { total: 0, bev: 0, phev: 0 };
    cur.total++;
    const t = (r["Electric Vehicle Type"] || "").toLowerCase();
    if (t.includes("bev")) cur.bev++;
    else if (t.includes("phev")) cur.phev++;
    map.set(make, cur);
  });
  return [...map.entries()]
    .map(([make, v]) => ({ make, ...v }))
    .sort((a,b) => b.total - a.total)
    .slice(0, k);
}

export function makeRangeBins(rows: EvRow[], binSize = 50) {
  const counts = new Map<number, number>();
  rows.forEach(r => {
    const rng = r["Electric Range"] ?? 0;
    if (!rng) return;
    const bin = Math.floor(rng / binSize) * binSize;
    counts.set(bin, (counts.get(bin) || 0) + 1);
  });
  const sorted = [...counts.entries()].sort((a,b)=>a[0]-b[0]);
  return sorted.map(([bin, count]) => ({ binStart: bin, count, label: `${bin}-${bin + binSize}` }));
}
