import type { EmployeeService } from '../services/EmployeeService';

export interface IEmployeeDirectoryProps {
  title: string;
  employeeService: EmployeeService;
}
