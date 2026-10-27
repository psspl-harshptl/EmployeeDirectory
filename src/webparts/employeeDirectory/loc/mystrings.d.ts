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

  NewEmployeeButton: string;
  NewEmployeeFormTitle: string;
  FieldEmpId: string;
  FieldUser: string;
  FieldDepartment: string;
  FieldDesignation: string;
  FieldMobileNo: string;
  FieldAddress: string;
  FieldDOB: string;
  FieldDOJ: string;
  FieldIsActive: string;
  SelectPlaceholder: string;
  DatePlaceholder: string;
  SubmitButton: string;
  SavingButton: string;
  CancelButton: string;

  RequiredFieldError: string;
  InvalidMobileNoError: string;
  FutureDateError: string;
  DojBeforeDobError: string;
  SaveSuccessMessage: string;
  SaveErrorMessage: string;
  LoadFormDataErrorMessage: string;
}

declare module 'EmployeeDirectoryWebPartStrings' {
  const strings: IEmployeeDirectoryWebPartStrings;
  export = strings;
}
