import type { IEmployee } from './IEmployee';

/** Employee properties the directory can be sorted by */
export type EmployeeSortField = keyof Pick<IEmployee, 'empId' | 'userTitle' | 'department' | 'designationTitle' | 'doj'>;

export interface IEmployeeSort {
  field: EmployeeSortField;
  isDescending: boolean;
}
