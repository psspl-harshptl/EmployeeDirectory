declare interface IEmployeeDirectoryWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  TitleFieldLabel: string;
  TitleFieldDescription: string;
  DefaultTitle: string;

  DisplayGroupName: string;
  ShowFiltersFieldLabel: string;
  ShowSortingFieldLabel: string;
  ToggleOnText: string;
  ToggleOffText: string;

  EmployeeCountFormat: string;
  NoEmployeesMessage: string;
  LoadErrorMessage: string;

  DepartmentFilterLabel: string;
  AllDepartmentsOption: string;
  StatusFilterLabel: string;
  StatusActive: string;
  StatusInactive: string;
  StatusAll: string;

  ColumnEmpId: string;
  ColumnEmployee: string;
  ColumnDepartment: string;
  ColumnDesignation: string;
  ColumnMobileNo: string;
  ColumnDOB: string;
  ColumnDOJ: string;
  ColumnAge: string;
  ColumnJoinedYears: string;
  ColumnStatus: string;
}

declare module 'EmployeeDirectoryWebPartStrings' {
  const strings: IEmployeeDirectoryWebPartStrings;
  export = strings;
}
