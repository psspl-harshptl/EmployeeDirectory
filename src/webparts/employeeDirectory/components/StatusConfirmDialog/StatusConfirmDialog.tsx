import * as React from 'react';
import { DefaultButton, Dialog, DialogFooter, DialogType, PrimaryButton } from '@fluentui/react';

import * as strings from 'EmployeeDirectoryWebPartStrings';
import { formatString } from '../../utils/stringUtils';
import type { IStatusConfirmDialogProps } from './IStatusConfirmDialogProps';

const StatusConfirmDialog: React.FC<IStatusConfirmDialogProps> = ({ employee, isUpdating, onConfirm, onCancel }) => {
  // Active employees are being deactivated, inactive ones activated.
  const willDeactivate = employee?.isActive ?? false;
  const employeeName = employee ? employee.userTitle || employee.empId : '';

  return (
    <Dialog
      hidden={employee === undefined}
      onDismiss={isUpdating ? undefined : onCancel}
      dialogContentProps={{
        type: DialogType.normal,
        title: willDeactivate ? strings.ConfirmDeactivateTitle : strings.ConfirmActivateTitle,
        subText: formatString(
          willDeactivate ? strings.ConfirmDeactivateMessage : strings.ConfirmActivateMessage,
          employeeName
        )
      }}
      modalProps={{ isBlocking: true }}
    >
      <DialogFooter>
        <PrimaryButton
          text={isUpdating ? strings.UpdatingButton : strings.ConfirmButton}
          disabled={isUpdating}
          onClick={onConfirm}
        />
        <DefaultButton text={strings.CancelButton} disabled={isUpdating} onClick={onCancel} />
      </DialogFooter>
    </Dialog>
  );
};

export default StatusConfirmDialog;
