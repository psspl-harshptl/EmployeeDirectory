import type { IEmployee } from '../../models/IEmployee';
import type { IEmployeeSort } from '../../models/IEmployeeSort';

export interface IEmployeeListProps {
  employees: IEmployee[];
  isLoading: boolean;
  sort: IEmployeeSort;
  /** When undefined, column headers are not clickable (sorting hidden from the property pane) */
  onSortChange?: (sort: IEmployeeSort) => void;
  onEdit: (employee: IEmployee) => void;
  onToggleActive: (employee: IEmployee) => void;
}
