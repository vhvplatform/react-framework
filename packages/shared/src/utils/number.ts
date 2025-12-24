/**
 * Clamp a number between min and max
 * @param value - Number to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate random integer between min and max (inclusive)
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random integer
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Round number to specified decimal places
 * @param value - Number to round
 * @param decimals - Number of decimal places
 * @returns Rounded number
 */
export function roundToDecimal(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Format number to fixed decimal places (returns string)
 * @param value - Number to format
 * @param decimals - Number of decimal places
 * @returns Formatted string
 */
export function toFixed(value: number, decimals: number): string {
  return value.toFixed(decimals);
}

/**
 * Check if number is in range (inclusive)
 * @param value - Number to check
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns true if in range
 */
export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Calculate percentage
 * @param value - Current value
 * @param total - Total value
 * @param decimals - Decimal places (default: 0)
 * @returns Percentage
 */
export function toPercentage(value: number, total: number, decimals = 0): number {
  if (total === 0) return 0;
  return roundToDecimal((value / total) * 100, decimals);
}

/**
 * Linear interpolation between two values
 * @param start - Start value
 * @param end - End value
 * @param t - Progress (0 to 1)
 * @returns Interpolated value
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * clamp(t, 0, 1);
}

/**
 * Check if number is even
 * @param value - Number to check
 * @returns true if even
 */
export function isEven(value: number): boolean {
  return value % 2 === 0;
}

/**
 * Check if number is odd
 * @param value - Number to check
 * @returns true if odd
 */
export function isOdd(value: number): boolean {
  return value % 2 !== 0;
}

/**
 * Sum array of numbers
 * @param numbers - Array of numbers
 * @returns Sum
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

/**
 * Average of array of numbers
 * @param numbers - Array of numbers
 * @returns Average
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return sum(numbers) / numbers.length;
}
