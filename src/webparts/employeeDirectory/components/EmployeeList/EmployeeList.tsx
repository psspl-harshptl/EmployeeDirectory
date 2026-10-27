import * as React from 'react';
import {
  DetailsListLayoutMode,
  IColumn,
  IconButton,
  Persona,
  PersonaSize,
  SelectionMode,
  ShimmeredDetailsList
} from '@fluentui/react';

import * as strings from 'EmployeeDirectoryWebPartStrings';
import type { IEmployee } from '../../models/IEmployee';
import type { EmployeeSortField } from '../../models/IEmployeeSort';
import { formatDate, getCompletedYears } from '../../utils/dateUtils';
import type { IEmployeeListProps } from './IEmployeeListProps';


const getEmployeeKey = (item: IEmployee | undefined, index?: number): string =>
  item ? String(item.id) : `placeholder-${index}`;

const EmployeeList: React.FC<IEmployeeListProps> = ({
  employees,
  isLoading,
  sort,
  onSortChange,
  onEdit,
  onToggleActive
}) => {
  const columns: IColumn[] = React.useMemo(() => {
    const sortableProps = (field: EmployeeSortField): Partial<IColumn> =>
      onSortChange
        ? {
            isSorted: sort.field === field,
            isSortedDescending: sort.field === field && sort.isDescending,
            onColumnClick: () =>
              onSortChange({ field, isDescending: sort.field === field ? !sort.isDescending : false })
          }
        : {};

    return [
      // First column, so the buttons stay visible when the grid scrolls horizontally on narrow pages.
      {
        key: 'actions',
        name: strings.ColumnActions,
        isIconOnly: true,
        minWidth: 70,
        maxWidth: 70,
        onRender: (item: IEmployee) => {
          const toggleLabel = item.isActive ? strings.DeactivateButtonLabel : strings.ActivateButtonLabel;
          return (
            <>
              <IconButton
                iconProps={{ iconName: 'Edit' }}
                title={strings.EditButtonLabel}
                ariaLabel={`${strings.EditButtonLabel} ${item.empId}`}
                onClick={() => onEdit(item)}
              />
              <IconButton
                iconProps={{ iconName: item.isActive ? 'UserRemove' : 'UserFollowed' }}
                title={toggleLabel}
                ariaLabel={`${toggleLabel} ${item.empId}`}
                onClick={() => onToggleActive(item)}
              />
            </>
          );
        }
      },
      {
        key: 'empId',
        name: strings.ColumnEmpId,
        fieldName: 'empId',
        minWidth: 80,
        maxWidth: 100,
        ...sortableProps('empId')
      },
      {
        key: 'employee',
        name: strings.ColumnEmployee,
        minWidth: 160,
        isMultiline: true,
        onRender: (item: IEmployee) => (
          <Persona text={item.userTitle} size={PersonaSize.size32} />
        ),
        ...sortableProps('userTitle')
      },
      {
        key: 'department',
        name: strings.ColumnDepartment,
        fieldName: 'department',
        minWidth: 90,
        maxWidth: 120,
        ...sortableProps('department')
      },
      {
        key: 'designation',
        name: strings.ColumnDesignation,
        fieldName: 'designationTitle',
        minWidth: 120,
        ...sortableProps('designationTitle')
      },
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
        onRender: (item: IEmployee) => formatDate(item.doj),
        ...sortableProps('doj')
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
      },
      {
        key: 'status',
        name: strings.ColumnStatus,
        minWidth: 60,
        maxWidth: 80,
        onRender: (item: IEmployee) => (item.isActive ? strings.StatusActive : strings.StatusInactive)
      }
    ];
  }, [sort, onSortChange, onEdit, onToggleActive]);

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
