export type EmployeeStatusFilter = 'active' | 'inactive' | 'all';

export interface IEmployeeFilters {
  department: string;
  status: EmployeeStatusFilter;
}
