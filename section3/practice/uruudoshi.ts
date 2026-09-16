export const uruudoshi = (year: number): string => {
  if (year % 400 === 0) return '閏年';
  if (year % 100 === 0) return '平年';
  if (year % 4 === 0) return '閏年';
  return '平年';
}