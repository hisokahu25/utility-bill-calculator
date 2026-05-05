// Residential rates table (منزلي)
export interface RateEntry {
  month: string;
  water: number;
  sewage: number;
  total: number;
}

export const residentialRates: RateEntry[] = [
  // 2023
  { month: "فبراير-23", water: 69, sewage: 44, total: 113 },
  { month: "مارس-23", water: 69, sewage: 44, total: 113 },
  { month: "أبريل-23", water: 69, sewage: 44, total: 113 },
  { month: "مايو-23", water: 69, sewage: 44, total: 113 },
  { month: "يونيو-23", water: 69, sewage: 44, total: 113 },
  { month: "يوليه-23", water: 69, sewage: 44, total: 113 },
  { month: "أغسطس-23", water: 69, sewage: 44, total: 113 },
  { month: "سبتمبر-23", water: 69, sewage: 44, total: 113 },
  { month: "أكتوبر-23", water: 69, sewage: 44, total: 113 },
  { month: "نوفمبر-23", water: 69, sewage: 44, total: 113 },
  // 2023-2024 transition
  { month: "ديسمبر-23", water: 79, sewage: 52, total: 131 },
  { month: "يناير-24", water: 79, sewage: 52, total: 131 },
  { month: "فبراير-24", water: 79, sewage: 52, total: 131 },
  { month: "مارس-24", water: 79, sewage: 52, total: 131 },
  { month: "أبريل-24", water: 79, sewage: 52, total: 131 },
  { month: "مايو-24", water: 79, sewage: 52, total: 131 },
  { month: "يونيو-24", water: 79, sewage: 52, total: 131 },
  { month: "يوليه-24", water: 79, sewage: 52, total: 131 },
  { month: "أغسطس-24", water: 79, sewage: 52, total: 131 },
  { month: "سبتمبر-24", water: 79, sewage: 52, total: 131 },
  { month: "أكتوبر-24", water: 79, sewage: 52, total: 131 },
  { month: "نوفمبر-24", water: 79, sewage: 52, total: 131 },
  { month: "ديسمبر-24", water: 79, sewage: 52, total: 131 },
  { month: "يناير-25", water: 79, sewage: 52, total: 131 },
  { month: "فبراير-25", water: 79, sewage: 52, total: 131 },
  { month: "مارس-25", water: 79, sewage: 52, total: 131 },
  // April 2025+
  { month: "أبريل-25", water: 89, sewage: 60, total: 149 },
  { month: "مايو-25", water: 89, sewage: 60, total: 149 },
  { month: "يونيو-25", water: 89, sewage: 60, total: 149 },
  { month: "يوليه-25", water: 89, sewage: 60, total: 149 },
  { month: "أغسطس-25", water: 89, sewage: 60, total: 149 },
  { month: "سبتمبر-25", water: 89, sewage: 60, total: 149 },
  // Oct 2025+
  { month: "أكتوبر-25", water: 99, sewage: 68, total: 167 },
  { month: "نوفمبر-25", water: 99, sewage: 68, total: 167 },
  { month: "ديسمبر-25", water: 99, sewage: 68, total: 167 },
  // Jan 2026+
  { month: "يناير-26", water: 109, sewage: 76, total: 185 },
  { month: "فبراير-26", water: 109, sewage: 76, total: 185 },
  { month: "مارس-26", water: 109, sewage: 76, total: 185 },
  { month: "أبريل-26", water: 109, sewage: 76, total: 185 },
  { month: "مايو-26", water: 109, sewage: 76, total: 185 },
  { month: "يونيو-26", water: 109, sewage: 76, total: 185 },
  { month: "يوليه-26", water: 109, sewage: 76, total: 185 },
  { month: "أغسطس-26", water: 109, sewage: 76, total: 185 },
  { month: "سبتمبر-26", water: 109, sewage: 76, total: 185 },
];

// Commercial rates table (تجاري)
export const commercialRates: RateEntry[] = [
  // Mar 2016 - Nov 2023
  ...Array.from({ length: 93 }, (_, i) => {
    const startDate = new Date(2016, 2, 1); // Mar 2016
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + i);
    const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليه", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const yr = d.getFullYear().toString().slice(-2);
    return {
      month: `${monthNames[d.getMonth()]}-${yr}`,
      water: 118.5,
      sewage: 72,
      total: 190.5,
    };
  }),
  // Dec 2023 - Mar 2025
  ...Array.from({ length: 16 }, (_, i) => {
    const d = new Date(2023, 11, 1); // Dec 2023
    d.setMonth(d.getMonth() + i);
    const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليه", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const yr = d.getFullYear().toString().slice(-2);
    return {
      month: `${monthNames[d.getMonth()]}-${yr}`,
      water: 129,
      sewage: 80,
      total: 209,
    };
  }),
  // Apr 2025 - Sep 2025
  ...["أبريل-25", "مايو-25", "يونيو-25", "يوليه-25", "أغسطس-25", "سبتمبر-25"].map(month => ({
    month, water: 139, sewage: 88, total: 227,
  })),
  // Oct 2025 - Dec 2025
  ...["أكتوبر-25", "نوفمبر-25", "ديسمبر-25"].map(month => ({
    month, water: 149, sewage: 96, total: 245,
  })),
  // Jan 2026 - Apr 2026
  ...["يناير-26", "فبراير-26", "مارس-26", "أبريل-26"].map(month => ({
    month, water: 159, sewage: 96, total: 255,
  })),
];

// Get the latest N rates from a table (most recent months)
export function getLatestRates(rates: RateEntry[], count: number): RateEntry[] {
  return rates.slice(-count);
}

// Calculate total for N months using the rate table (from latest backwards)
export function calculateFromRates(
  rates: RateEntry[],
  months: number,
  billingType: "with_sewage" | "without_sewage"
): { entries: RateEntry[]; total: number } {
  const entries = getLatestRates(rates, months);
  const total = entries.reduce((sum, entry) => {
    if (billingType === "with_sewage") return sum + entry.total;
    return sum + entry.water;
  }, 0);
  return { entries, total };
}
