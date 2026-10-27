import type { IEmployeeFilters } from '../../models/IEmployeeFilters';

export interface IEmployeeFilterBarProps {
  filters: IEmployeeFilters;
  departmentChoices: string[];
  onFiltersChange: (filters: IEmployeeFilters) => void;
}
