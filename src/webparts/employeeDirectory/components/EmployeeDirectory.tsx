
import * as React from 'react';
import {
  DefaultButton,
  PrimaryButton,
  Stack,
  Text,
  SearchBox,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn
} from '@fluentui/react';

import type { IEmployeeDirectoryProps } from './IEmployeeDirectoryProps';

interface IEmployee {
  id: string;
  name: string;
  department: string;
  designation: string;
  mobile: string;
  isActive: boolean;
}

const sampleEmployees: IEmployee[] = [
  {
    id: 'EMP001',
    name: 'Aarav Patel',
    department: 'IT',
    designation: 'UI Developer',
    mobile: '9876543210',
    isActive: true
  },
  {
    id: 'EMP002',
    name: 'Diya Shah',
    department: 'HR',
    designation: 'HR Executive',
    mobile: '9876543211',
    isActive: true
  },
  {
    id: 'EMP003',
    name: 'Krish Mehta',
    department: 'Marketing',
    designation: 'Marketing Executive',
    mobile: '9876543212',
    isActive: false
  }
];

export default class EmployeeDirectory extends React.Component<IEmployeeDirectoryProps> {
  private readonly _columns: IColumn[] = [
    { key: 'id', name: 'Employee ID', fieldName: 'id', minWidth: 90 },
    { key: 'name', name: 'Employee', fieldName: 'name', minWidth: 120 },
    { key: 'department', name: 'Department', fieldName: 'department', minWidth: 100 },
    { key: 'designation', name: 'Designation', fieldName: 'designation', minWidth: 120 },
    { key: 'mobile', name: 'Mobile Number', fieldName: 'mobile', minWidth: 110 }
  ];

  public render(): React.ReactElement<IEmployeeDirectoryProps> {
    const activeEmployees = sampleEmployees.filter(employee => employee.isActive);

    return (
      <Stack tokens={{ childrenGap: 16 }}>
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
          <Text variant="xLarge" as="h2">
            {this.props.title || 'Employee Directory'}
          </Text>

          <PrimaryButton
            text="New Employee"
            iconProps={{ iconName: 'Add' }}
            onClick={() => alert('Employee form will be implemented next.')}
          />
        </Stack>

        <SearchBox
          placeholder="Search employees..."
          ariaLabel="Search employees"
        />

        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <DefaultButton text="Filters" iconProps={{ iconName: 'Filter' }} />
          <DefaultButton text="Sort" iconProps={{ iconName: 'Sort' }} />
          <Text variant="medium">Active employees: {activeEmployees.length}</Text>
        </Stack>

        <DetailsList
          items={activeEmployees}
          columns={this._columns}
          selectionMode={SelectionMode.none}
          layoutMode={DetailsListLayoutMode.justified}
        />
      </Stack>
    );
  }
}
