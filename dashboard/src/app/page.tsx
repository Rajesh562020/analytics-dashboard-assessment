"use client";
import { useEffect, useMemo, useState } from "react";
import { loadEvCsv } from "../lib/loadData";
import { computeKPIs, topMakes, makeRangeBins } from "../lib/metrics";
import KpiCard from "../components/KpiCard";
import TopMakesBar from "../components/TopMakesBar";
import RangeHistogram from "../components/RangeHistogram";
import Filters from "../components/Filters";
import CsvExport from "../components/CsvExport";
import type { EvRow , Filterss  } from "../types/ev";


export default function Page() {
  const [rows, setRows] = useState<EvRow[]>([]);
  const [filtered, setFiltered] = useState<EvRow[]>([]);
  const [filters, setFilters] = useState<Filterss>({ make: "", type: "ALL", yearMin: undefined, yearMax: undefined });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    loadEvCsv("/data/Electric_Vehicle_Population_Data.csv").then(setRows);
  }, []);

  // apply filters
  useEffect(() => {
    // console.log(">>>>>>>>>>>>>",rows)
    const out = rows.filter(r => {
      if (filters.make && r.Make !== filters.make) return false;
      if (filters.type === "BEV" && !(r["Electric Vehicle Type"]||"").toLowerCase().includes("bev")) return false;
      if (filters.type === "PHEV" && !(r["Electric Vehicle Type"]||"").toLowerCase().includes("phev")) return false;
      if (filters.yearMin && (r["Model Year"] ?? 0) < filters.yearMin) return false;
      if (filters.yearMax && (r["Model Year"] ?? 0) > filters.yearMax) return false;
      return true;
    });
    setFiltered(out);
  }, [rows, filters]);

  // log filtered data
  // useEffect(() => {
  //   console.log("Filtered data:", filtered, "count:", filtered.length);
  // }, [filtered]);

  // reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters, rows]);

  const kpis = useMemo(() => computeKPIs(filtered.length ? filtered : rows), [rows, filtered]);
  const makes = useMemo(() => topMakes(filtered.length ? filtered : rows), [rows, filtered]);
  const rangeBins = useMemo(() => makeRangeBins(filtered.length ? filtered : rows, 50), [rows, filtered]);

  const data = filtered.length ? filtered : rows;
  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const end = Math.min(total, start + pageSize);
  const pageRows = data.slice(start, end);

  return (
    <main className="p-6 min-h-screen bg-red-50">
      <h1 className="text-2xl font-bold mb-4">EV Analytics Dashboard</h1>

      <div className="grid grid-cols-12 gap-4">
        {/* <aside className="col-span-12 lg:col-span-3">
          <Filters rows={rows} onChange={(f) => setFilters(f as any)} />
          <div className="mt-4"><CsvExport rows={filtered.length ? filtered : rows} /></div>
        </aside> */}

        <aside className="col-span-12 lg:col-span-3">
          <div className="lg:hidden bg-white rounded shadow">
            <details>
              <summary className="cursor-pointer list-none px-4 py-3 font-medium border-b">
                Filters
              </summary>
              <div className="p-4">
                <Filters rows={rows} value={filters} onChange={setFilters} />
                <div className="mt-4"><CsvExport rows={filtered.length ? filtered : rows} /></div>
              </div>
            </details>
          </div>

          <div className="hidden lg:block">
            <Filters rows={rows} value={filters} onChange={setFilters} />
            <div className="mt-4"><CsvExport rows={filtered.length ? filtered : rows} /></div>
          </div>
        </aside>

        <section className="col-span-12 lg:col-span-9 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <KpiCard title="Total EVs" value={kpis.total} />
            <KpiCard title="BEV %" value={kpis.bevPct.toFixed(1) + "%"} />
            <KpiCard title="Median Range" value={kpis.medianRange} suffix=" mi" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TopMakesBar data={makes} />
            <RangeHistogram data={rangeBins.map(b => ({ label: b.label, count: b.count }))} />
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">
              Data Table
              <span className="ml-2 text-gray-500 text-sm">{total ? `${start + 1}-${end} of ${total}` : "0 results"}</span>
            </h3>
            {/* Mobile list < sm */}
            <div className="sm:hidden space-y-2">
              {pageRows.map((r, i) => (
                <div key={start + i} className="border rounded p-3 bg-white">
                 <div className="flex justify-between">
                  <span className="font-medium">{r.Make}{r.Model}</span>
                  <span className="text-xs text-gray-500">
                   {r["Model Year"] ?? "-"}
                  </span>
                 </div>
                 <div className="mt-1 grid grid-cols-2 gap-1 text-sm">
                   <div><span className="text-gray-500">Type:</span>
                   {r["Electric Vehicle Type"] ?? "-"}
                   </div>
                   <div><span className="text-gray-500">Range:</span>
                   {r["Electric Range"] ?? "-"}
                   </div>
                   <div><span className="text-gray-500">County:</span>
                   {r.County ?? "-"}
                   </div>
                   <div><span className="text-gray-500">City:</span>
                   {r.City ?? "-"}
                   </div>

                 </div>

                </div>
              ))}
            </div>








             {/* Desktop list >= sm */}
            <div className="overflow-auto hidden sm:block">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="p-2 text-left">Make</th>
                    <th className="p-2 text-left">Model</th>
                    <th className="p-2 text-left">Year</th>
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Range</th>
                    <th className="p-2 text-left">County</th>
                    <th className="p-2 text-left">City</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((r, i) => (
                    <tr key={start + i} className="border-b odd:bg-gray-50 hover:bg-gray-100">
                      <td className="p-2">{r.Make}</td>
                      <td className="p-2">{r.Model}</td>
                      <td className="p-2">{r["Model Year"]}</td>
                      <td className="p-2">{r["Electric Vehicle Type"]}</td>
                      <td className="p-2">{r["Electric Range"]}</td>
                      <td className="p-2">{r.County}</td>
                      <td className="p-2">{r.City}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-2 border rounded disabled:opacity-50"
                  onClick={() => setPage(1)}
                  disabled={page <= 1}
                >First</button>
                <button
                  className="px-3 py-2 border rounded disabled:opacity-50"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >Prev</button>
                <span className="px-2">Page {page} / {totalPages}</span>
                <button
                  className="px-3 py-2 border rounded disabled:opacity-50"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >Next</button>
                <button
                  className="px-3 py-2 border rounded disabled:opacity-50"
                  onClick={() => setPage(totalPages)}
                  disabled={page >= totalPages}
                >Last</button>
              </div>

              <label className="flex items-center gap-2">
                <span>Rows per page</span>
                <select
                  className="border rounded p-2"
                  value={pageSize}
                  onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                >
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                </select>
              </label>
            </div>
          </div>
        {/*  <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Data Table (first 200 rows)</h3>
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Make</th>
                    <th className="p-2">Model</th>
                    <th className="p-2">Year</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Range</th>
                    <th className="p-2">County</th>
                    <th className="p-2">City</th>
                  </tr>
                </thead>
                <tbody>
                  {(filtered.length ? filtered : rows).slice(0,200).map((r, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2">{r.Make}</td>
                      <td className="p-2">{r.Model}</td>
                      <td className="p-2">{r["Model Year"]}</td>
                      <td className="p-2">{r["Electric Vehicle Type"]}</td>
                      <td className="p-2">{r["Electric Range"]}</td>
                      <td className="p-2">{r.County}</td>
                      <td className="p-2">{r.City}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        */}
        </section>
      </div>
    </main>
  );
}
