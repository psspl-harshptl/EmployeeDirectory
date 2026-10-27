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
 * Converts a picked date into the value written to a SharePoint "Date Only" column.
 * The time is reset to local midnight before converting to UTC. This mirrors how SharePoint's
 * own forms store dates and how parseSPDate reads them back, so a date round-trips unchanged
 * as long as the browser and the site regional settings use the same time zone.
 */
export function toSPDateValue(date: Date | undefined): string | undefined {
  if (!date) {
    return undefined;
  }

  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
}

/**
 * Returns the date with the time removed, for day-level comparisons.
 */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
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
