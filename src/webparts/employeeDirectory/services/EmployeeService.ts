import type { SPFI } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';

import { EMPLOYEE_FIELDS, LIST_TITLES } from '../constants/Constants';
import type { IEmployee } from '../models/IEmployee';
import { parseSPDate } from '../utils/dateUtils';

/**
 * Raw shape of an Employee list item as returned by SharePoint REST.
 * Property names are the column internal names (see EMPLOYEE_FIELDS).
 * SharePoint REST returns null for empty fields, so null is modelled explicitly here.
 */
/* eslint-disable @rushstack/no-new-null */
interface ISPEmployeeItem {
  Id: number;
  Title: string | null;
  Department: string | null;
  MobileNo: number | null;
  Address: string | null;
  DOB: string | null;
  DOJ: string | null;
  IsActive: boolean | null;
  User?: { Id: number; Title: string; EMail: string } | null;
  Designation?: { Id: number; Title: string } | null;
}
/* eslint-enable @rushstack/no-new-null */

/**
 * All SharePoint data access for the Employee Directory.
 * Components never call PnPjs directly; they go through this service.
 */
export class EmployeeService {
  private readonly _sp: SPFI;

  constructor(sp: SPFI) {
    this._sp = sp;
  }

  public async getEmployees(): Promise<IEmployee[]> {
    const f = EMPLOYEE_FIELDS;

    const items: ISPEmployeeItem[] = await this._sp.web.lists
      .getByTitle(LIST_TITLES.Employee)
      .items.select(
        f.Id,
        f.EmpId,
        f.Department,
        f.MobileNo,
        f.Address,
        f.DOB,
        f.DOJ,
        f.IsActive,
        `${f.User}/Id`,
        `${f.User}/Title`,
        `${f.User}/EMail`,
        `${f.Designation}/Id`,
        `${f.Designation}/Title`
      )
      .expand(f.User, f.Designation)
      .orderBy(f.EmpId, true)
      .top(5000)();

    return items.map((item) => this._mapEmployee(item));
  }

  private _mapEmployee(item: ISPEmployeeItem): IEmployee {
    return {
      id: item.Id,
      empId: item.Title ?? '',
      userId: item.User?.Id,
      userTitle: item.User?.Title ?? '',
      userEmail: item.User?.EMail ?? '',
      department: item.Department ?? '',
      designationId: item.Designation?.Id,
      designationTitle: item.Designation?.Title ?? '',
      mobileNo: item.MobileNo !== null ? String(item.MobileNo) : '',
      address: item.Address ?? '',
      dob: parseSPDate(item.DOB),
      doj: parseSPDate(item.DOJ),
      isActive: item.IsActive === true
    };
  }
}
