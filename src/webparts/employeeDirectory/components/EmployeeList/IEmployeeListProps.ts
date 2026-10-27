import type { IEmployee } from '../../models/IEmployee';

export interface IEmployeeListProps {
  employees: IEmployee[];
  isLoading: boolean;
}
