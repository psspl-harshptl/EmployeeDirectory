import * as React from 'react';
import { MessageBar, MessageBarType, PrimaryButton, Stack, Text } from '@fluentui/react';

import * as strings from 'EmployeeDirectoryWebPartStrings';
import { DEFAULT_FILTERS, DEFAULT_SORT } from '../constants/Constants';
import type { IEmployee } from '../models/IEmployee';
import type { IEmployeeFilters } from '../models/IEmployeeFilters';
import type { IEmployeeFormData } from '../models/IEmployeeFormData';
import type { IEmployeeSort } from '../models/IEmployeeSort';
import type { IPosition } from '../models/IPosition';
import { filterEmployees, sortEmployees } from '../utils/employeeQueryUtils';
import { EmployeeValidationError } from '../utils/employeeValidation';
import { formatString } from '../utils/stringUtils';
import styles from './EmployeeDirectory.module.scss';
import EmployeeFilterBar from './EmployeeFilterBar/EmployeeFilterBar';
import EmployeeForm from './EmployeeForm/EmployeeForm';
import EmployeeList from './EmployeeList/EmployeeList';
import type { IEmployeeDirectoryProps } from './IEmployeeDirectoryProps';
import StatusConfirmDialog from './StatusConfirmDialog/StatusConfirmDialog';

interface INotification {
  type: MessageBarType;
  text: string;
}

const EmployeeDirectory: React.FC<IEmployeeDirectoryProps> = ({
  title,
  showFilters,
  showSorting,
  employeeService,
  peoplePickerContext
}) => {
  const [employees, setEmployees] = React.useState<IEmployee[]>([]);
  const [departmentChoices, setDepartmentChoices] = React.useState<string[]>([]);
  const [positions, setPositions] = React.useState<IPosition[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined);
  const [formOptionsError, setFormOptionsError] = React.useState<string | undefined>(undefined);
  const [notification, setNotification] = React.useState<INotification | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = React.useState<boolean>(false);
  const [editingEmployee, setEditingEmployee] = React.useState<IEmployee | undefined>(undefined);
  const [statusChangeEmployee, setStatusChangeEmployee] = React.useState<IEmployee | undefined>(undefined);
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState<boolean>(false);
  const [filters, setFilters] = React.useState<IEmployeeFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = React.useState<IEmployeeSort>(DEFAULT_SORT);


  const isMountedRef = React.useRef<boolean>(true);
  React.useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadEmployees = React.useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const result = await employeeService.getEmployees();
      if (isMountedRef.current) {
        setEmployees(result);
      }
    } catch (error) {
      console.error('EmployeeDirectory: failed to load employees', error);
      if (isMountedRef.current) {
        setErrorMessage(strings.LoadErrorMessage);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [employeeService]);

  React.useEffect(() => {
    loadEmployees().catch(() => undefined);
  }, [loadEmployees]);


  React.useEffect(() => {
    Promise.all([employeeService.getDepartmentChoices(), employeeService.getPositions()])
      .then(([choices, positionItems]) => {
        if (isMountedRef.current) {
          setDepartmentChoices(choices);
          setPositions(positionItems);
        }
      })
      .catch((error) => {
        console.error('EmployeeDirectory: failed to load form options', error);
        if (isMountedRef.current) {
          setFormOptionsError(strings.LoadFormDataErrorMessage);
        }
      });
  }, [employeeService]);

  const openNewEmployeeForm = (): void => {
    setNotification(undefined);
    setEditingEmployee(undefined);
    setIsFormOpen(true);
  };

  // useCallback keeps these stable, so the grid's memoized columns are not rebuilt on every render.
  const handleEdit = React.useCallback((employee: IEmployee): void => {
    setNotification(undefined);
    setEditingEmployee(employee);
    setIsFormOpen(true);
  }, []);

  const handleToggleActive = React.useCallback((employee: IEmployee): void => {
    setNotification(undefined);
    setStatusChangeEmployee(employee);
  }, []);

  const handleSubmit = async (data: IEmployeeFormData): Promise<void> => {
    try {
      // Friendly checks before saving; "Enforce unique values" on the EmpID and User columns is the server-side guarantee.
      // Both run in parallel so the user sees every duplicate at once.
      const [isEmpIdTaken, isUserTaken] = await Promise.all([
        employeeService.isEmpIdAlreadyAdded(data.empId, editingEmployee?.id),
        data.userId !== undefined
          ? employeeService.isUserAlreadyAdded(data.userId, editingEmployee?.id)
          : Promise.resolve(false)
      ]);

      if (isEmpIdTaken || isUserTaken) {
        throw new EmployeeValidationError({
          empId: isEmpIdTaken ? strings.DuplicateEmpIdError : undefined,
          userId: isUserTaken ? strings.DuplicateUserError : undefined
        });
      }

      if (editingEmployee) {
        await employeeService.updateEmployee(editingEmployee.id, data);
      } else {
        await employeeService.addEmployee(data);
      }
    } catch (error) {
      // A validation error is an expected outcome, not a failure worth logging.
      if (!(error instanceof EmployeeValidationError)) {
        console.error('EmployeeDirectory: failed to save employee', error);
      }
      throw error;
    }

    setIsFormOpen(false);
    setNotification({
      type: MessageBarType.success,
      text: editingEmployee ? strings.UpdateSuccessMessage : strings.SaveSuccessMessage
    });
    await loadEmployees();
  };

  const confirmStatusChange = async (): Promise<void> => {
    if (!statusChangeEmployee) {
      return;
    }

    const employee = statusChangeEmployee;
    const newIsActive = !employee.isActive;
    const employeeName = employee.userTitle || employee.empId;

    setIsUpdatingStatus(true);
    try {
      await employeeService.setEmployeeActive(employee.id, newIsActive);
      if (isMountedRef.current) {
        // Only one field changed, so update the row locally instead of reloading the whole list.
        setEmployees((previous) =>
          previous.map((item) => (item.id === employee.id ? { ...item, isActive: newIsActive } : item))
        );
        setNotification({
          type: MessageBarType.success,
          text: formatString(newIsActive ? strings.ActivatedMessage : strings.DeactivatedMessage, employeeName)
        });
      }
    } catch (error) {
      console.error('EmployeeDirectory: failed to update employee status', error);
      if (isMountedRef.current) {
        setNotification({ type: MessageBarType.error, text: strings.StatusUpdateErrorMessage });
      }
    } finally {
      if (isMountedRef.current) {
        setIsUpdatingStatus(false);
        setStatusChangeEmployee(undefined);
      }
    }
  };


  const effectiveFilters = showFilters ? filters : DEFAULT_FILTERS;
  const effectiveSort = showSorting ? sort : DEFAULT_SORT;

  const visibleEmployees = React.useMemo(
    () => sortEmployees(filterEmployees(employees, effectiveFilters), effectiveSort),
    [employees, effectiveFilters, effectiveSort]
  );

  return (
    <section className={styles.employeeDirectory}>
      <Stack tokens={{ childrenGap: 16 }}>
        <Stack horizontal wrap horizontalAlign="space-between" verticalAlign="center" tokens={{ childrenGap: 8 }}>
          <Text variant="xLarge" as="h2">
            {title || strings.DefaultTitle}
          </Text>
          <PrimaryButton
            text={strings.NewEmployeeButton}
            iconProps={{ iconName: 'AddFriend' }}
            onClick={openNewEmployeeForm}
          />
        </Stack>

        {notification && (
          <MessageBar
            messageBarType={notification.type}
            isMultiline
            onDismiss={() => setNotification(undefined)}
          >
            {notification.text}
          </MessageBar>
        )}

        {formOptionsError && (
          <MessageBar messageBarType={MessageBarType.warning} onDismiss={() => setFormOptionsError(undefined)}>
            {formOptionsError}
          </MessageBar>
        )}

        {errorMessage && (
          <MessageBar messageBarType={MessageBarType.error} isMultiline>
            {errorMessage}
          </MessageBar>
        )}

        {!errorMessage && (
          <>
            {showFilters && (
              <EmployeeFilterBar
                filters={filters}
                departmentChoices={departmentChoices}
                onFiltersChange={setFilters}
              />
            )}

            {!isLoading && (
              <Text variant="medium">
                {formatString(strings.EmployeeCountFormat, visibleEmployees.length, employees.length)}
              </Text>
            )}

            <EmployeeList
              employees={visibleEmployees}
              isLoading={isLoading}
              sort={effectiveSort}
              onSortChange={showSorting ? setSort : undefined}
              onEdit={handleEdit}
              onToggleActive={handleToggleActive}
            />

            {!isLoading && visibleEmployees.length === 0 && (
              <MessageBar>{strings.NoEmployeesMessage}</MessageBar>
            )}
          </>
        )}
      </Stack>

      <EmployeeForm
        isOpen={isFormOpen}
        employee={editingEmployee}
        departmentChoices={departmentChoices}
        positions={positions}
        peoplePickerContext={peoplePickerContext}
        onSubmit={handleSubmit}
        onDismiss={() => setIsFormOpen(false)}
      />

      <StatusConfirmDialog
        employee={statusChangeEmployee}
        isUpdating={isUpdatingStatus}
        onConfirm={() => {
          confirmStatusChange().catch(() => undefined);
        }}
        onCancel={() => setStatusChangeEmployee(undefined)}
      />
    </section>
  );
};

export default EmployeeDirectory;
