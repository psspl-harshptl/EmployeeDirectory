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
import styles from './EmployeeDirectory.module.scss';
import EmployeeFilterBar from './EmployeeFilterBar/EmployeeFilterBar';
import EmployeeForm from './EmployeeForm/EmployeeForm';
import EmployeeList from './EmployeeList/EmployeeList';
import type { IEmployeeDirectoryProps } from './IEmployeeDirectoryProps';

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
  const [successMessage, setSuccessMessage] = React.useState<string | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = React.useState<boolean>(false);
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


  // Options for the filter bar and the form only need loading once.
  // A failure here should not hide the employee list, so it shows a separate warning.
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
    setSuccessMessage(undefined);
    setIsFormOpen(true);
  };

  // Errors are re-thrown so the form keeps the user's input and shows its own error message.
  const handleSubmit = async (data: IEmployeeFormData): Promise<void> => {
    try {
      await employeeService.addEmployee(data);
    } catch (error) {
      console.error('EmployeeDirectory: failed to save employee', error);
      throw error;
    }

    setIsFormOpen(false);
    setSuccessMessage(strings.SaveSuccessMessage);
    await loadEmployees();
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

        {successMessage && (
          <MessageBar messageBarType={MessageBarType.success} onDismiss={() => setSuccessMessage(undefined)}>
            {successMessage}
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
                {strings.EmployeeCountFormat
                  .replace('{0}', String(visibleEmployees.length))
                  .replace('{1}', String(employees.length))}
              </Text>
            )}

            <EmployeeList
              employees={visibleEmployees}
              isLoading={isLoading}
              sort={effectiveSort}
              onSortChange={showSorting ? setSort : undefined}
            />

            {!isLoading && visibleEmployees.length === 0 && (
              <MessageBar>{strings.NoEmployeesMessage}</MessageBar>
            )}
          </>
        )}
      </Stack>

      <EmployeeForm
        isOpen={isFormOpen}
        departmentChoices={departmentChoices}
        positions={positions}
        peoplePickerContext={peoplePickerContext}
        onSubmit={handleSubmit}
        onDismiss={() => setIsFormOpen(false)}
      />
    </section>
  );
};

export default EmployeeDirectory;
