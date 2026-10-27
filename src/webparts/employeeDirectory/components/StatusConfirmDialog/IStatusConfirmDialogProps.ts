import type { IEmployee } from '../../models/IEmployee';

export interface IStatusConfirmDialogProps {
  /** Employee whose status will change; the dialog is hidden when undefined */
  employee: IEmployee | undefined;
  isUpdating: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
