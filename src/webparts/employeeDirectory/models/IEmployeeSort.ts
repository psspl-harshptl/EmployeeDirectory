import type { IEmployee } from './IEmployee';

export type EmployeeSortField = keyof Pick<IEmployee, 'empId' | 'userTitle' | 'department' | 'designationTitle' | 'doj'>;

export interface IEmployeeSort {
  field: EmployeeSortField;
  isDescending: boolean;
}
