/**
 * Replaces {0}, {1}, ... placeholders in a localized string with the given values.
 */
export function formatString(template: string, ...values: (string | number)[]): string {
  return template.replace(/\{(\d+)\}/g, (match, index: string) => {
    const value = values[Number(index)];
    return value !== undefined ? String(value) : match;
  });
}
