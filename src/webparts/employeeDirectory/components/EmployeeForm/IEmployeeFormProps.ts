import type { IPeoplePickerContext } from '@pnp/spfx-controls-react/lib/PeoplePicker';

import type { IEmployeeFormData } from '../../models/IEmployeeFormData';
import type { IPosition } from '../../models/IPosition';

export interface IEmployeeFormProps {
  isOpen: boolean;
  departmentChoices: string[];
  positions: IPosition[];
  peoplePickerContext: IPeoplePickerContext;
  /** Should reject if saving fails, so the form can keep the user's input and show an error */
  onSubmit: (data: IEmployeeFormData) => Promise<void>;
  onDismiss: () => void;
}
