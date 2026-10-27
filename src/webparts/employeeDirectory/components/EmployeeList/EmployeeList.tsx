import * as React from 'react';
import {
  DetailsListLayoutMode,
  IColumn,
  Persona,
  PersonaSize,
  SelectionMode,
  ShimmeredDetailsList
} from '@fluentui/react';

import * as strings from 'EmployeeDirectoryWebPartStrings';
import type { IEmployee } from '../../models/IEmployee';
import { formatDate, getCompletedYears } from '../../utils/dateUtils';
import type { IEmployeeListProps } from './IEmployeeListProps';

// While shimmering, the list renders placeholder rows that are null, so fall back to the row index.
const getEmployeeKey = (item: IEmployee | undefined, index?: number): string =>
  item ? String(item.id) : `placeholder-${index}`;

const EmployeeList: React.FC<IEmployeeListProps> = ({ employees, isLoading }) => {
  const columns: IColumn[] = React.useMemo(
    () => [
      { key: 'empId', name: strings.ColumnEmpId, fieldName: 'empId', minWidth: 80, maxWidth: 100 },
      {
        key: 'employee',
        name: strings.ColumnEmployee,
        minWidth: 160,
        isMultiline: true,
        onRender: (item: IEmployee) => (
          <Persona text={item.userTitle} size={PersonaSize.size32} />
        )
      },
      { key: 'department', name: strings.ColumnDepartment, fieldName: 'department', minWidth: 90, maxWidth: 120 },
      { key: 'designation', name: strings.ColumnDesignation, fieldName: 'designationTitle', minWidth: 120 },
      { key: 'mobileNo', name: strings.ColumnMobileNo, fieldName: 'mobileNo', minWidth: 100, maxWidth: 120 },
      {
        key: 'dob',
        name: strings.ColumnDOB,
        minWidth: 90,
        maxWidth: 110,
        onRender: (item: IEmployee) => formatDate(item.dob)
      },
      {
        key: 'doj',
        name: strings.ColumnDOJ,
        minWidth: 90,
        maxWidth: 110,
        onRender: (item: IEmployee) => formatDate(item.doj)
      },
      {
        key: 'age',
        name: strings.ColumnAge,
        minWidth: 40,
        maxWidth: 60,
        onRender: (item: IEmployee) => getCompletedYears(item.dob) ?? ''
      },
      {
        key: 'joinedYears',
        name: strings.ColumnJoinedYears,
        minWidth: 80,
        maxWidth: 100,
        onRender: (item: IEmployee) => getCompletedYears(item.doj) ?? ''
      }
    ],
    []
  );

  return (
    <ShimmeredDetailsList
      items={employees}
      columns={columns}
      getKey={getEmployeeKey}
      setKey="employees"
      enableShimmer={isLoading}
      selectionMode={SelectionMode.none}
      layoutMode={DetailsListLayoutMode.justified}
    />
  );
};

export default EmployeeList;
