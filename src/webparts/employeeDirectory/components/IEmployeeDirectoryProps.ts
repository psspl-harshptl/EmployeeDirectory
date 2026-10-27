import type { EmployeeService } from '../services/EmployeeService';

export interface IEmployeeDirectoryProps {
  title: string;
  showFilters: boolean;
  showSorting: boolean;
  employeeService: EmployeeService;
}
