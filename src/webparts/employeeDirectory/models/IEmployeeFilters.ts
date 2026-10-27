export type EmployeeStatusFilter = 'active' | 'inactive' | 'all';

export interface IEmployeeFilters {
  /** Empty string means all departments */
  department: string;
  status: EmployeeStatusFilter;
}
