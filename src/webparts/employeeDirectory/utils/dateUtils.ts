/**
 * Converts an ISO date string returned by SharePoint REST into a Date.
 * Returns undefined for empty or invalid values.
 */
// eslint-disable-next-line @rushstack/no-new-null -- SharePoint REST returns null for empty date fields
export function parseSPDate(value: string | null | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  return isNaN(date.getTime()) ? undefined : date;
}

/**
 * Number of full years between `from` and `to` (default: today).
 * Used for Age (from DOB) and Joined Years (from DOJ). Calculated here instead of
 * relying on the list's calculated columns, which only refresh when an item is saved.
 */
export function getCompletedYears(from: Date | undefined, to: Date = new Date()): number | undefined {
  if (!from) {
    return undefined;
  }

  let years = to.getFullYear() - from.getFullYear();
  const anniversaryNotReached =
    to.getMonth() < from.getMonth() ||
    (to.getMonth() === from.getMonth() && to.getDate() < from.getDate());

  if (anniversaryNotReached) {
    years--;
  }

  return Math.max(years, 0);
}

/**
 * Formats a date as e.g. "15 Mar 1995" using the browser locale.
 */
export function formatDate(date: Date | undefined): string {
  if (!date) {
    return '';
  }

  return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}
