# Employee Directory

## Summary

An SPFx web part for viewing and managing employees stored in a SharePoint list. It shows the employees in a sortable, filterable grid and lets users add employees, edit them, and mark them active or inactive.

Features:

- **Employee grid** (Fluent UI `DetailsList`) with Emp ID, employee name/email, department, designation, mobile no., DOB, DOJ, calculated **age** and **years since joining**, and status.
- **Filters** by department and by status (Active / Inactive / All). Defaults to Active.
- **Column sorting** on Emp ID, Employee, Department, Designation and DOJ.
- **New / Edit Employee** panel with a PnP People Picker, department and designation dropdowns, date pickers and field-level validation.
- **Duplicate checks** against SharePoint, so the same Emp ID or user cannot be added twice.
- **Activate / Deactivate** with a confirmation dialog. The row is updated in place without reloading the list.
- Filters and sorting can each be turned on or off in the property pane.

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/SPFx-1.23.2-green.svg)
![react](https://img.shields.io/badge/React-17.0.1-blue.svg)
![node](https://img.shields.io/badge/Node-22.14%2B%20%3C23-brightgreen.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://learn.microsoft.com/sharepoint/dev/spfx/set-up-your-developer-tenant)

Supported hosts: SharePoint web part, SharePoint full page, Teams tab, Teams personal app.

## Prerequisites

The web part reads from two lists on the site it is added to.

### `Positions` list

| Column | Type                    |
| ------ | ----------------------- |
| Title  | Single line of text     |

Each item is a designation, for example "Software Engineer".

### `Employee` list

| Internal name | Display purpose | Type                                         | Notes                                   |
| ------------- | --------------- | -------------------------------------------- | --------------------------------------- |
| `Title`       | Emp ID          | Single line of text                          | Must be unique                          |
| `User`        | Employee        | Person or Group (people only)                | Must be unique                          |
| `Department`  | Department      | Choice                                       | Choices populate the form and filter    |
| `Designation` | Designation     | Lookup → `Positions` list, `Title` column    |                                         |
| `MobileNo`    | Mobile No.      | Number                                       | 10 digits                               |
| `Address`     | Address         | Multiple lines of text                       |                                         |
| `DOB`         | Date of birth   | Date only                                    | Cannot be in the future                 |
| `DOJ`         | Date of joining | Date only                                    | Cannot be in the future; must be after DOB |
| `IsActive`    | Status          | Yes/No                                       | Default: Yes                            |

List titles and internal field names are defined in [Constants.ts](src/webparts/employeeDirectory/constants/Constants.ts). Change them there if your lists use different names.

## Web part properties

| Property      | Default              | Description                                |
| ------------- | -------------------- | ------------------------------------------ |
| `title`       | Employee Directory   | Heading shown above the grid               |
| `showFilters` | On                   | Shows the department and status filters    |
| `showSorting` | On                   | Lets users sort by clicking column headers |

When filters or sorting are turned off, the grid falls back to the defaults: active employees only, sorted by Emp ID ascending.

## Project structure

```
src/webparts/employeeDirectory/
├── EmployeeDirectoryWebPart.ts       # Web part entry: PnPjs setup, property pane, renders the React root
├── components/                       # React function components (hooks, no class components)
│   ├── EmployeeDirectory.tsx         # Root: loads data, holds state, wires child components
│   ├── EmployeeFilterBar/            # Department and status dropdowns
│   ├── EmployeeList/                 # DetailsList grid with sorting and row actions
│   ├── EmployeeForm/                 # New/Edit panel with People Picker and validation
│   └── StatusConfirmDialog/          # Activate/deactivate confirmation
├── services/EmployeeService.ts       # All SharePoint reads and writes (PnPjs v4)
├── models/                           # TypeScript interfaces
├── utils/                            # Filtering/sorting, validation, date and string helpers
├── constants/Constants.ts            # List titles, field names, defaults
└── loc/                              # Localized strings
```

The web part class extends `BaseClientSideWebPart` because SPFx requires it. Every UI component is a React function component typed as `React.FC<Props>` and uses hooks (`useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`) for state and side effects.

## Getting started

1. Clone the repository and open the solution folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set `initialPage` in [config/serve.json](config/serve.json) to the workbench URL of your site, for example `https://<tenant>.sharepoint.com/sites/<site>/_layouts/15/workbench.aspx`.
4. Create the `Positions` and `Employee` lists described above on that site.
5. Start the local dev server:

   ```bash
   npm start
   ```

6. Add the **Employee Directory** web part (in the Advanced group) to the workbench page.

## Build and deploy

```bash
npm run build
```

This runs a production build and creates `sharepoint/solution/employee-directory.sppkg`. Upload the package to your tenant or site collection App Catalog, then add the app to the site. `skipFeatureDeployment` is enabled, so the web part can be made available to all sites at once.

## Scripts

| Command         | Description                                       |
| --------------- | ------------------------------------------------- |
| `npm start`     | Clean, build and serve locally with hot reload    |
| `npm run build` | Run tests, production build and package `.sppkg`  |
| `npm run clean` | Delete build output                               |

## Tech stack

- SharePoint Framework 1.23.2 (Heft build toolchain)
- React 17, TypeScript 5.8
- Fluent UI React v8
- PnPjs v4 (`@pnp/sp`)
- PnP SPFx React Controls (`PeoplePicker`)

## Version history

| Version | Date             | Comments                                                         |
| ------- | ---------------- | ---------------------------------------------------------------- |
| 1.0     | October 30, 2026 | Grid, filters, sorting, add/edit form, duplicate checks, activate/deactivate |

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**
