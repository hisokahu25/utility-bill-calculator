export interface RateEntry {
  month: string;
  water: number;
  sewage: number;
  total: number;
}

const arabicMonths = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليه", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

function monthLabel(d: Date): string {
  return `${arabicMonths[d.getMonth()]}-${d.getFullYear().toString().slice(-2)}`;
}

// Residential rate tiers by date boundaries
interface RateTier {
  from: Date; // inclusive
  to: Date;   // exclusive
  water: number;
  sewage: number;
}

const residentialTiers: RateTier[] = [
  // Before Dec 2023 → same as Feb-23
  { from: new Date(2000, 0, 1), to: new Date(2023, 11, 1), water: 69, sewage: 44 },
  { from: new Date(2023, 11, 1), to: new Date(2025, 3, 1), water: 79, sewage: 52 },
  { from: new Date(2025, 3, 1), to: new Date(2025, 9, 1), water: 89, sewage: 60 },
  { from: new Date(2025, 9, 1), to: new Date(2026, 0, 1), water: 99, sewage: 68 },
  { from: new Date(2026, 0, 1), to: new Date(2099, 0, 1), water: 109, sewage: 76 },
];

const commercialTiers: RateTier[] = [
  { from: new Date(2000, 0, 1), to: new Date(2023, 11, 1), water: 118.5, sewage: 72 },
  { from: new Date(2023, 11, 1), to: new Date(2025, 3, 1), water: 129, sewage: 80 },
  { from: new Date(2025, 3, 1), to: new Date(2025, 9, 1), water: 139, sewage: 88 },
  { from: new Date(2025, 9, 1), to: new Date(2026, 0, 1), water: 149, sewage: 96 },
  { from: new Date(2026, 0, 1), to: new Date(2099, 0, 1), water: 159, sewage: 96 },
];

function getRateForDate(d: Date, tiers: RateTier[]): { water: number; sewage: number; total: number } {
  for (const tier of tiers) {
    if (d >= tier.from && d < tier.to) {
      return { water: tier.water, sewage: tier.sewage, total: tier.water + tier.sewage };
    }
  }
  const last = tiers[tiers.length - 1];
  return { water: last.water, sewage: last.sewage, total: last.water + last.sewage };
}

// Generate rates for N months going backwards from current month
export function getRatesForMonths(
  months: number,
  type: "residential" | "commercial"
): RateEntry[] {
  const tiers = type === "residential" ? residentialTiers : commercialTiers;
  const now = new Date();
  const entries: RateEntry[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const rate = getRateForDate(d, tiers);
    entries.push({ month: monthLabel(d), ...rate });
  }
  return entries;
}

// Generate rates for N months going FORWARD from current month
export function getRatesForMonthsForward(
  months: number,
  type: "residential" | "commercial"
): RateEntry[] {
  const tiers = type === "residential" ? residentialTiers : commercialTiers;
  const now = new Date();
  const entries: RateEntry[] = [];
  for (let i = 0; i < months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const rate = getRateForDate(d, tiers);
    entries.push({ month: monthLabel(d), ...rate });
  }
  return entries;
}

export function calculateFromRates(
  type: "residential" | "commercial",
  months: number,
  billingType: "with_sewage" | "without_sewage"
): { entries: RateEntry[]; total: number } {
  const entries = getRatesForMonths(months, type);
  const total = entries.reduce((sum, entry) => {
    if (billingType === "with_sewage") return sum + entry.total;
    return sum + entry.water;
  }, 0);
  return { entries, total };
}
