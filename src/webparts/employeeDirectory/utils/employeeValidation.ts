import * as strings from 'EmployeeDirectoryWebPartStrings';
import type { IEmployeeFormData } from '../models/IEmployeeFormData';
import { startOfDay } from './dateUtils';

export type EmployeeFormErrors = Partial<Record<keyof IEmployeeFormData, string>>;

const MOBILE_NUMBER_PATTERN = /^\d{10}$/;

/**
 * Validates the New/Edit Employee form. Returns an empty object when the form is valid.
 * IsActive is not validated: unchecked is a valid answer, so a checkbox cannot be "required".
 */
export function validateEmployeeForm(data: IEmployeeFormData, today: Date = new Date()): EmployeeFormErrors {
  const errors: EmployeeFormErrors = {};
  const todayStart = startOfDay(today);

  if (!data.empId.trim()) {
    errors.empId = strings.RequiredFieldError;
  }

  if (data.userId === undefined) {
    errors.userId = strings.RequiredFieldError;
  }

  if (!data.department) {
    errors.department = strings.RequiredFieldError;
  }

  if (data.designationId === undefined) {
    errors.designationId = strings.RequiredFieldError;
  }

  if (!data.mobileNo.trim()) {
    errors.mobileNo = strings.RequiredFieldError;
  } else if (!MOBILE_NUMBER_PATTERN.test(data.mobileNo.trim())) {
    errors.mobileNo = strings.InvalidMobileNoError;
  }

  if (!data.address.trim()) {
    errors.address = strings.RequiredFieldError;
  }

  if (!data.dob) {
    errors.dob = strings.RequiredFieldError;
  } else if (startOfDay(data.dob) > todayStart) {
    errors.dob = strings.FutureDateError;
  }

  if (!data.doj) {
    errors.doj = strings.RequiredFieldError;
  } else if (startOfDay(data.doj) > todayStart) {
    errors.doj = strings.FutureDateError;
  } else if (data.dob && startOfDay(data.doj) <= startOfDay(data.dob)) {
    errors.doj = strings.DojBeforeDobError;
  }

  return errors;
}

/**
 * Thrown when a check that needs SharePoint (e.g. duplicate user) fails, so the form can show
 * the message under the related field instead of a generic save error.
 */
export class EmployeeValidationError extends Error {
  public readonly errors: EmployeeFormErrors;

  constructor(errors: EmployeeFormErrors) {
    super('Employee form validation failed');
    this.name = 'EmployeeValidationError';
    this.errors = errors;
    // The project compiles to ES5, where extending Error breaks instanceof unless the prototype is restored.
    Object.setPrototypeOf(this, EmployeeValidationError.prototype);
  }
}
