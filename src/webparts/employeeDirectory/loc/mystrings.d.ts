declare interface IEmployeeDirectoryWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  TitleFieldLabel: string;
  TitleFieldDescription: string;
  DefaultTitle: string;

  ActiveEmployeesLabel: string;
  NoEmployeesMessage: string;
  LoadErrorMessage: string;

  ColumnEmpId: string;
  ColumnEmployee: string;
  ColumnDepartment: string;
  ColumnDesignation: string;
  ColumnMobileNo: string;
  ColumnDOB: string;
  ColumnDOJ: string;
  ColumnAge: string;
  ColumnJoinedYears: string;
}

declare module 'EmployeeDirectoryWebPartStrings' {
  const strings: IEmployeeDirectoryWebPartStrings;
  export = strings;
}
