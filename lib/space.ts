import type { SectorId } from "@/content/sectors";

export type PortfolioInput = {
  sectors: SectorId[];
  families: number;
  brands: number;
  machinery: boolean;
  demo: boolean;
  meetingRoom: boolean;
};

/**
 * Smart stand recommendation. Starts from a 9 m² shell unit and adds space for
 * each product family, brand, live demonstration, machinery and meetings.
 * Rounded to the 9 m² module used on the exhibition floor.
 */
export function recommendSpace(p: PortfolioInput): { min: number; max: number } {
  let base = 9;
  base += Math.max(0, p.families - 1) * 6;
  base += Math.max(0, p.brands - 1) * 9;
  if (p.demo) base += 18;
  if (p.meetingRoom) base += 12;
  if (p.machinery || p.sectors.includes("surface-technologies")) base += 45;
  if (p.sectors.includes("natural-engineered-stone")) base += 9; // slab racks
  const mod = (x: number) => Math.max(9, Math.ceil(x / 9) * 9);
  const min = mod(base);
  const max = mod(base * 1.6);
  return { min, max: max === min ? min + 9 : max };
}
