export interface IEmployeeFormData {
  empId: string;
  /** Site user Id resolved by the people picker */
  userId: number | undefined;
  /** Used to pre-fill the people picker in edit mode */
  userEmail: string;
  department: string;
  designationId: number | undefined;
  /** Kept as text in the form; converted to a number when saved */
  mobileNo: string;
  address: string;
  dob: Date | undefined;
  doj: Date | undefined;
  isActive: boolean;
}
