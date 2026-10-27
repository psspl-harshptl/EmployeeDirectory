import type { IEmployeeFilters } from '../models/IEmployeeFilters';
import type { IEmployeeFormData } from '../models/IEmployeeFormData';
import type { IEmployeeSort } from '../models/IEmployeeSort';

export const LIST_TITLES = {
  Employee: 'Employee',
  Positions: 'Positions'
} as const;

// Internal names of the Employee list columns (verified from List Settings).
// EmpID was created by renaming the OOTB Title column, so its internal name is still "Title".
export const EMPLOYEE_FIELDS = {
  Id: 'Id',
  EmpId: 'Title',
  User: 'User',
  Department: 'Department',
  Designation: 'Designation',
  MobileNo: 'MobileNo',
  Address: 'Address',
  DOB: 'DOB',
  DOJ: 'DOJ',
  IsActive: 'IsActive'
} as const;

export const POSITION_FIELDS = {
  Id: 'Id',
  Title: 'Title'
} as const;

export const EMPTY_EMPLOYEE_FORM: IEmployeeFormData = {
  empId: '',
  userId: undefined,
  userEmail: '',
  department: '',
  designationId: undefined,
  mobileNo: '',
  address: '',
  dob: undefined,
  doj: undefined,
  isActive: true
};

// Also applied when filters/sorting are hidden from the property pane,
// so the directory always falls back to showing active employees by Employee ID.
export const DEFAULT_FILTERS: IEmployeeFilters = {
  department: '',
  status: 'active'
};

export const DEFAULT_SORT: IEmployeeSort = {
  field: 'empId',
  isDescending: false
};
