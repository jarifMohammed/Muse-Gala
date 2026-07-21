/**
 * Calculates the total rental price for an 8-day rental based on the 4-day base price
 * using a tiered multiplier system.
 * 
 * Tiers:
 * - $0   to $150 → x1.7
 * - $150 to $300 → x1.55
 * - $300 to $500 → x1.4
 * - $500 to $800 → x1.3
 * - $800+       → x1.2
 * 
 * @param basePrice - The 4-day rental price
 * @returns The calculated 8-day rental price
 */
export function calculate8DayRentalPrice(basePrice: number): number {
  let multiplier = 1.2; // Default for $800+

  if (basePrice <= 150) {
    multiplier = 1.7;
  } else if (basePrice <= 300) {
    multiplier = 1.55;
  } else if (basePrice <= 500) {
    multiplier = 1.4;
  } else if (basePrice <= 800) {
    multiplier = 1.3;
  }

  // Round to 2 decimal places to avoid floating point issues
  return Math.round((basePrice * multiplier) * 100) / 100;
}
