import * as React from 'react';
import { MessageBar, MessageBarType, Stack, Text } from '@fluentui/react';

import * as strings from 'EmployeeDirectoryWebPartStrings';
import type { IEmployee } from '../models/IEmployee';
import styles from './EmployeeDirectory.module.scss';
import EmployeeList from './EmployeeList/EmployeeList';
import type { IEmployeeDirectoryProps } from './IEmployeeDirectoryProps';

const EmployeeDirectory: React.FC<IEmployeeDirectoryProps> = ({ title, employeeService }) => {
  const [employees, setEmployees] = React.useState<IEmployee[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined);

  // Prevents state updates if the web part is removed while a request is still running.
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

  const activeEmployees = React.useMemo(
    () => employees.filter((employee) => employee.isActive),
    [employees]
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
            {!isLoading && (
              <Text variant="medium">
                {strings.ActiveEmployeesLabel}: {activeEmployees.length}
              </Text>
            )}

            <EmployeeList employees={activeEmployees} isLoading={isLoading} />

            {!isLoading && activeEmployees.length === 0 && (
              <MessageBar>{strings.NoEmployeesMessage}</MessageBar>
            )}
          </>
        )}
      </Stack>
    </section>
  );
};

export default EmployeeDirectory;
