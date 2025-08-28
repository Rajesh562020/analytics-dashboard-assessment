import Papa from "papaparse";
import { EvRowSchema } from "../types/ev";
import type { EvRow } from "../types/ev";

/**
 * Loads and validates an EV CSV file.
 * @param path - The path to the CSV file (default: /data/Electric_Vehicle_Population.csv).
 * @returns A promise that resolves to a list of validated EV rows.
 */
export async function loadEvCsv(
  path = "/data/Electric_Vehicle_Population_Data.csv"
): Promise<EvRow[]> {
  try {
    const res = await fetch(path);

    if (!res.ok) {
      throw new Error(`Failed to fetch CSV: ${res.status} ${res.statusText}`);
    }

    const text = await res.text();

    const parsed = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // keep all as string, validate with zod
      transformHeader: (header) => header.trim(), // clean headers
    });

    if (parsed.errors.length > 0) {
      console.warn("CSV parse errors:", parsed.errors);
    }

    return parsed.data
      .map((row) => {
        const validated = EvRowSchema.safeParse(row);
        if (validated.success) {
          return validated.data;
        } else {
          console.warn("Row validation failed:", validated.error.issues);
          return null;
        }
      })
      .filter((row): row is EvRow => row !== null);
  } catch (err) {
    console.error("Error loading CSV:", err);
    return [];
  }
}
