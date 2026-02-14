/**
 * Get date range constraints for the date picker
 * Min: earliest asteroid in database (1893)
 * Max: current year
 */
export function getDateRange() {
  const minDate = '1893-01-01';
  const maxDate = new Date().toISOString().split('T')[0];
  
  return { minDate, maxDate };
}
