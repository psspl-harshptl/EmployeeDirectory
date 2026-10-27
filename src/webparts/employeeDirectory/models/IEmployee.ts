export interface IEmployee {
  /** SharePoint list item Id */
  id: number;
  empId: string;
  userId: number | undefined;
  userTitle: string;
  userEmail: string;
  department: string;
  designationId: number | undefined;
  designationTitle: string;
  mobileNo: string;
  address: string;
  dob: Date | undefined;
  doj: Date | undefined;
  isActive: boolean;
}
