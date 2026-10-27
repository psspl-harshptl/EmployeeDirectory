import type { IPeoplePickerContext } from '@pnp/spfx-controls-react/lib/PeoplePicker';

import type { EmployeeService } from '../services/EmployeeService';

export interface IEmployeeDirectoryProps {
  title: string;
  showFilters: boolean;
  showSorting: boolean;
  employeeService: EmployeeService;
  peoplePickerContext: IPeoplePickerContext;
}
