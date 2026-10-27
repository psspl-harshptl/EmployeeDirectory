declare interface IEmployeeDirectoryWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  TitleFieldLabel: string;
  TitleFieldDescription: string;
  DefaultTitle: string;
}

declare module 'EmployeeDirectoryWebPartStrings' {
  const strings: IEmployeeDirectoryWebPartStrings;
  export = strings;
}
