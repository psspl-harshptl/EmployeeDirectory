import * as React from 'react';
import { MessageBar, MessageBarType, Stack, Text } from '@fluentui/react';

import * as strings from 'EmployeeDirectoryWebPartStrings';
import { DEFAULT_FILTERS, DEFAULT_SORT } from '../constants/Constants';
import type { IEmployee } from '../models/IEmployee';
import type { IEmployeeFilters } from '../models/IEmployeeFilters';
import type { IEmployeeSort } from '../models/IEmployeeSort';
import { filterEmployees, sortEmployees } from '../utils/employeeQueryUtils';
import styles from './EmployeeDirectory.module.scss';
import EmployeeFilterBar from './EmployeeFilterBar/EmployeeFilterBar';
import EmployeeList from './EmployeeList/EmployeeList';
import type { IEmployeeDirectoryProps } from './IEmployeeDirectoryProps';

const EmployeeDirectory: React.FC<IEmployeeDirectoryProps> = ({
  title,
  showFilters,
  showSorting,
  employeeService
}) => {
  const [employees, setEmployees] = React.useState<IEmployee[]>([]);
  const [departmentChoices, setDepartmentChoices] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined);
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

  // Department choices only need loading once; a failure here should not hide the employee list.
  React.useEffect(() => {
    employeeService
      .getDepartmentChoices()
      .then((choices) => {
        if (isMountedRef.current) {
          setDepartmentChoices(choices);
        }
      })
      .catch((error) => console.error('EmployeeDirectory: failed to load department choices', error));
  }, [employeeService]);

  // Hidden filters/sorting must not keep affecting the list, so fall back to the defaults.
  const effectiveFilters = showFilters ? filters : DEFAULT_FILTERS;
  const effectiveSort = showSorting ? sort : DEFAULT_SORT;

  const visibleEmployees = React.useMemo(
    () => sortEmployees(filterEmployees(employees, effectiveFilters), effectiveSort),
    [employees, effectiveFilters, effectiveSort]
  );

  return (
    <section className={styles.employeeDirectory}>
      <Stack tokens={{ childrenGap: 16 }}>
        <Text variant="xLarge" as="h2">
          {title || strings.DefaultTitle}
        </Text>

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
    </section>
  );
};

export default EmployeeDirectory;
