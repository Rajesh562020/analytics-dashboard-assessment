import { z } from "zod";

export const EvRowSchema = z.object({
  "VIN (1-10)": z.string().optional().default(""),
  County: z.string().optional().default(""),
  City: z.string().optional().default(""),
  State: z.string().optional().default(""),
  "Postal Code": z.string().optional().default(""),
  "Model Year": z.coerce.number().optional(),
  Make: z.string().optional().default(""),
  Model: z.string().optional().default(""),
  "Electric Vehicle Type": z.string().optional().default(""),
  "Clean Alternative Fuel Vehicle (CAFV) Eligibility": z.string().optional().default(""),
  "Electric Range": z.coerce.number().optional().default(0),
  "Base MSRP": z.coerce.number().optional().default(0),
  "Legislative District": z.string().optional().default(""),
  "DOL Vehicle ID": z.string().optional().default(""),
  "Vehicle Location": z.string().optional().default(""), // e.g. POINT (-122.30839 47.610365)
  "Electric Utility": z.string().optional().default(""),
  "2020 Census Tract": z.string().optional().default(""),
});

export type EvRow = z.infer<typeof EvRowSchema>;

export type Filterss = {
  make: string;
  type: "ALL" | "BEV" | "PHEV";
  yearMin?: number;
  yearMax?: number;
};

