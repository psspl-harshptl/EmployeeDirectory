import type { SPFI } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/fields';

import { EMPLOYEE_FIELDS, LIST_TITLES, POSITION_FIELDS } from '../constants/Constants';
import type { IEmployee } from '../models/IEmployee';
import type { IEmployeeFormData } from '../models/IEmployeeFormData';
import type { IPosition } from '../models/IPosition';
import { parseSPDate, toSPDateValue } from '../utils/dateUtils';

// SharePoint REST returns null for empty fields, so null is modelled explicitly here.
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


  public async getDepartmentChoices(): Promise<string[]> {
    const field = await this._sp.web.lists
      .getByTitle(LIST_TITLES.Employee)
      .fields.getByInternalNameOrTitle(EMPLOYEE_FIELDS.Department)
      .select('Choices')();

    return field.Choices ?? [];
  }

  public async getPositions(): Promise<IPosition[]> {
    const items: { Id: number; Title: string }[] = await this._sp.web.lists
      .getByTitle(LIST_TITLES.Positions)
      .items.select(POSITION_FIELDS.Id, POSITION_FIELDS.Title)
      .orderBy(POSITION_FIELDS.Title, true)
      .top(5000)();

    return items.map((item) => ({ id: item.Id, title: item.Title }));
  }

  public async addEmployee(data: IEmployeeFormData): Promise<void> {
    await this._sp.web.lists
      .getByTitle(LIST_TITLES.Employee)
      .items.add(this._mapToListItem(data));
  }

  /**
   * Converts form data into the payload SharePoint expects.
   * People and Lookup columns are written through their "<InternalName>Id" property.
   */
  private _mapToListItem(data: IEmployeeFormData): Record<string, unknown> {
    const f = EMPLOYEE_FIELDS;

    return {
      [f.EmpId]: data.empId.trim(),
      [`${f.User}Id`]: data.userId,
      [f.Department]: data.department,
      [`${f.Designation}Id`]: data.designationId,
      [f.MobileNo]: Number(data.mobileNo),
      [f.Address]: data.address.trim(),
      [f.DOB]: toSPDateValue(data.dob),
      [f.DOJ]: toSPDateValue(data.doj),
      [f.IsActive]: data.isActive
    };
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
