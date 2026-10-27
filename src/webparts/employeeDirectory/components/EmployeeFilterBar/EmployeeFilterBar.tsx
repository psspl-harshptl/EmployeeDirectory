import * as React from 'react';
import { Dropdown, IDropdownOption, IDropdownStyles, Stack } from '@fluentui/react';

import * as strings from 'EmployeeDirectoryWebPartStrings';
import type { EmployeeStatusFilter } from '../../models/IEmployeeFilters';
import type { IEmployeeFilterBarProps } from './IEmployeeFilterBarProps';

const dropdownStyles: Partial<IDropdownStyles> = { root: { width: 180 } };

const STATUS_OPTIONS: IDropdownOption[] = [
  { key: 'active', text: strings.StatusActive },
  { key: 'inactive', text: strings.StatusInactive },
  { key: 'all', text: strings.StatusAll }
];

const EmployeeFilterBar: React.FC<IEmployeeFilterBarProps> = ({ filters, departmentChoices, onFiltersChange }) => {
  const departmentOptions: IDropdownOption[] = React.useMemo(
    () => [
      { key: '', text: strings.AllDepartmentsOption },
      ...departmentChoices.map((choice) => ({ key: choice, text: choice }))
    ],
    [departmentChoices]
  );

  return (
    <Stack horizontal wrap tokens={{ childrenGap: 12 }}>
      <Dropdown
        label={strings.DepartmentFilterLabel}
        options={departmentOptions}
        selectedKey={filters.department}
        styles={dropdownStyles}
        onChange={(_, option) => onFiltersChange({ ...filters, department: String(option?.key ?? '') })}
      />
      <Dropdown
        label={strings.StatusFilterLabel}
        options={STATUS_OPTIONS}
        selectedKey={filters.status}
        styles={dropdownStyles}
        onChange={(_, option) =>
          option && onFiltersChange({ ...filters, status: option.key as EmployeeStatusFilter })
        }
      />
    </Stack>
  );
};

export default EmployeeFilterBar;
