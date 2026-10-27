export interface IEmployeeFormData {
  empId: string;
  userId: number | undefined;
  userEmail: string;
  department: string;
  designationId: number | undefined;
  mobileNo: string;
  address: string;
  dob: Date | undefined;
  doj: Date | undefined;
  isActive: boolean;
}
