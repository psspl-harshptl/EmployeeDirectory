import * as React from 'react';
import {
  Checkbox,
  DatePicker,
  DefaultButton,
  Dropdown,
  IDropdownOption,
  IPersonaProps,
  MessageBar,
  MessageBarType,
  Panel,
  PanelType,
  PrimaryButton,
  Stack,
  TextField
} from '@fluentui/react';
import { PeoplePicker, PrincipalType } from '@pnp/spfx-controls-react/lib/PeoplePicker';

import * as strings from 'EmployeeDirectoryWebPartStrings';
import { EMPTY_EMPLOYEE_FORM } from '../../constants/Constants';
import type { IEmployee } from '../../models/IEmployee';
import type { IEmployeeFormData } from '../../models/IEmployeeFormData';
import { formatDate } from '../../utils/dateUtils';
import { EmployeeFormErrors, EmployeeValidationError, validateEmployeeForm } from '../../utils/employeeValidation';
import type { IEmployeeFormProps } from './IEmployeeFormProps';


function parseSiteUserId(person: IPersonaProps | undefined): number | undefined {
  const id = Number(person?.id);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

function toFormData(employee: IEmployee): IEmployeeFormData {
  return {
    empId: employee.empId,
    userId: employee.userId,
    userEmail: employee.userEmail,
    department: employee.department,
    designationId: employee.designationId,
    mobileNo: employee.mobileNo,
    address: employee.address,
    dob: employee.dob,
    doj: employee.doj,
    isActive: employee.isActive
  };
}

const EmployeeForm: React.FC<IEmployeeFormProps> = ({
  isOpen,
  employee,
  departmentChoices,
  positions,
  peoplePickerContext,
  onSubmit,
  onDismiss
}) => {
  const [formData, setFormData] = React.useState<IEmployeeFormData>(EMPTY_EMPLOYEE_FORM);
  const [errors, setErrors] = React.useState<EmployeeFormErrors>({});
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [saveError, setSaveError] = React.useState<string | undefined>(undefined);
  const [peoplePickerDefaultUsers, setPeoplePickerDefaultUsers] = React.useState<string[]>([]);
  const [peoplePickerKey, setPeoplePickerKey] = React.useState<number>(0);

  const today = React.useMemo(() => new Date(), []);
  const isEditMode = employee !== undefined;

  // Each time the panel opens, start from the selected employee (edit) or an empty form (new).
  React.useEffect(() => {
    if (!isOpen) {
      return;
    }
    setFormData(employee ? toFormData(employee) : EMPTY_EMPLOYEE_FORM);
    setErrors({});
    setSaveError(undefined);
    setPeoplePickerDefaultUsers(employee?.userEmail ? [employee.userEmail] : []);
    setPeoplePickerKey((key) => key + 1);
  }, [isOpen, employee]);

  const departmentOptions: IDropdownOption[] = React.useMemo(
    () => departmentChoices.map((choice) => ({ key: choice, text: choice })),
    [departmentChoices]
  );

  const designationOptions: IDropdownOption[] = React.useMemo(
    () => positions.map((position) => ({ key: position.id, text: position.title })),
    [positions]
  );

  const updateField = <K extends keyof IEmployeeFormData>(field: K, value: IEmployeeFormData[K]): void => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const resetForm = (): void => {
    setFormData(EMPTY_EMPLOYEE_FORM);
    setErrors({});
    setSaveError(undefined);
    setPeoplePickerDefaultUsers([]);
    setPeoplePickerKey((key) => key + 1);
  };

  const handleCancel = (): void => {
    if (isSaving) {
      return;
    }
    resetForm();
    onDismiss();
  };

  const handleSubmit = async (): Promise<void> => {
    const validationErrors = validateEmployeeForm(formData, today);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);
    setSaveError(undefined);
    try {
      await onSubmit(formData);
      resetForm();
    } catch (error) {
      if (error instanceof EmployeeValidationError) {
        setErrors(error.errors);
      } else {
        setSaveError(strings.SaveErrorMessage);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const onRenderFooterContent = (): JSX.Element => (
    <Stack horizontal tokens={{ childrenGap: 8 }}>
      <PrimaryButton
        text={isSaving ? strings.SavingButton : isEditMode ? strings.UpdateButton : strings.SubmitButton}
        disabled={isSaving}
        onClick={() => {
          handleSubmit().catch(() => undefined);
        }}
      />
      <DefaultButton text={strings.CancelButton} disabled={isSaving} onClick={handleCancel} />
    </Stack>
  );

  return (
    <Panel
      isOpen={isOpen}
      type={PanelType.medium}
      headerText={isEditMode ? strings.EditEmployeeFormTitle : strings.NewEmployeeFormTitle}
      closeButtonAriaLabel={strings.CancelButton}
      onDismiss={handleCancel}
      onRenderFooterContent={onRenderFooterContent}
      isFooterAtBottom
    >
      <Stack tokens={{ childrenGap: 12 }}>
        {saveError && (
          <MessageBar messageBarType={MessageBarType.error} isMultiline>
            {saveError}
          </MessageBar>
        )}

        <TextField
          label={strings.FieldEmpId}
          required
          maxLength={255}
          value={formData.empId}
          errorMessage={errors.empId}
          disabled={isSaving}
          onChange={(_, value) => updateField('empId', value ?? '')}
        />

        <PeoplePicker
          key={peoplePickerKey}
          context={peoplePickerContext}
          titleText={strings.FieldUser}
          personSelectionLimit={1}
          principalTypes={[PrincipalType.User]}
          ensureUser
          required
          resolveDelay={300}
          defaultSelectedUsers={peoplePickerDefaultUsers}
          errorMessage={errors.userId}
          disabled={isSaving}
          onChange={(people: IPersonaProps[]) => {
            const person = people[0];
            setFormData((previous) => ({
              ...previous,
              userId: parseSiteUserId(person),
              userEmail: person?.secondaryText ?? ''
            }));
            setErrors((previous) => ({ ...previous, userId: undefined }));
          }}
        />

        <Dropdown
          label={strings.FieldDepartment}
          required
          placeholder={strings.SelectPlaceholder}
          options={departmentOptions}
          selectedKey={formData.department || null}
          errorMessage={errors.department}
          disabled={isSaving}
          onChange={(_, option) => updateField('department', String(option?.key ?? ''))}
        />

        <Dropdown
          label={strings.FieldDesignation}
          required
          placeholder={strings.SelectPlaceholder}
          options={designationOptions}
          selectedKey={formData.designationId ?? null}
          errorMessage={errors.designationId}
          disabled={isSaving}
          onChange={(_, option) =>
            updateField('designationId', option !== undefined ? Number(option.key) : undefined)
          }
        />

        <TextField
          label={strings.FieldMobileNo}
          required
          inputMode="numeric"
          maxLength={10}
          value={formData.mobileNo}
          errorMessage={errors.mobileNo}
          disabled={isSaving}
          onChange={(_, value) => updateField('mobileNo', value ?? '')}
        />

        <TextField
          label={strings.FieldAddress}
          required
          multiline
          rows={3}
          value={formData.address}
          errorMessage={errors.address}
          disabled={isSaving}
          onChange={(_, value) => updateField('address', value ?? '')}
        />

        <DatePicker
          label={strings.FieldDOB}
          placeholder={strings.DatePlaceholder}
          value={formData.dob}
          maxDate={today}
          formatDate={formatDate}
          disabled={isSaving}
          textField={{ required: true, errorMessage: errors.dob }}
          onSelectDate={(date) => updateField('dob', date ?? undefined)}
        />

        <DatePicker
          label={strings.FieldDOJ}
          placeholder={strings.DatePlaceholder}
          value={formData.doj}
          minDate={formData.dob}
          maxDate={today}
          formatDate={formatDate}
          disabled={isSaving}
          textField={{ required: true, errorMessage: errors.doj }}
          onSelectDate={(date) => updateField('doj', date ?? undefined)}
        />

        <Checkbox
          label={strings.FieldIsActive}
          checked={formData.isActive}
          disabled={isSaving}
          onChange={(_, checked) => updateField('isActive', !!checked)}
        />
      </Stack>
    </Panel>
  );
};

export default EmployeeForm;
