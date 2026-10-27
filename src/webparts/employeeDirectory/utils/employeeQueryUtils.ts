import type { IEmployee } from '../models/IEmployee';
import type { IEmployeeFilters } from '../models/IEmployeeFilters';
import type { IEmployeeSort } from '../models/IEmployeeSort';

export function filterEmployees(employees: IEmployee[], filters: IEmployeeFilters): IEmployee[] {
  return employees.filter((employee) => {
    if (filters.status === 'active' && !employee.isActive) {
      return false;
    }
    if (filters.status === 'inactive' && employee.isActive) {
      return false;
    }
    if (filters.department && employee.department !== filters.department) {
      return false;
    }
    return true;
  });
}

/**
 * Returns a sorted copy; the input array is never mutated.
 * Empty values are always placed last, regardless of direction.
 */
export function sortEmployees(employees: IEmployee[], sort: IEmployeeSort): IEmployee[] {
  const direction = sort.isDescending ? -1 : 1;

  return [...employees].sort((a, b) => {
    const valueA = a[sort.field];
    const valueB = b[sort.field];

    const isEmptyA = valueA === undefined || valueA === '';
    const isEmptyB = valueB === undefined || valueB === '';
    if (isEmptyA || isEmptyB) {
      return Number(isEmptyA) - Number(isEmptyB);
    }

    if (valueA instanceof Date && valueB instanceof Date) {
      return (valueA.getTime() - valueB.getTime()) * direction;
    }

    return String(valueA).localeCompare(String(valueB), undefined, { numeric: true, sensitivity: 'base' }) * direction;
  });
}
