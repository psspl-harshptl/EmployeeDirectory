import type { IPeoplePickerContext } from '@pnp/spfx-controls-react/lib/PeoplePicker';

import type { IEmployee } from '../../models/IEmployee';
import type { IEmployeeFormData } from '../../models/IEmployeeFormData';
import type { IPosition } from '../../models/IPosition';

export interface IEmployeeFormProps {
  isOpen: boolean;
  /** Employee being edited; undefined means the form creates a new employee */
  employee?: IEmployee;
  departmentChoices: string[];
  positions: IPosition[];
  peoplePickerContext: IPeoplePickerContext;
  onSubmit: (data: IEmployeeFormData) => Promise<void>;
  onDismiss: () => void;
}
