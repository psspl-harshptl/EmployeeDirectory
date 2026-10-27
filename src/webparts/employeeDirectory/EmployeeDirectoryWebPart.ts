import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { spfi, SPFx } from '@pnp/sp';
import type { IPeoplePickerContext } from '@pnp/spfx-controls-react/lib/PeoplePicker';

import * as strings from 'EmployeeDirectoryWebPartStrings';
import EmployeeDirectory from './components/EmployeeDirectory';
import { IEmployeeDirectoryProps } from './components/IEmployeeDirectoryProps';
import { EmployeeService } from './services/EmployeeService';

export interface IEmployeeDirectoryWebPartProps {
  title: string;
  showFilters: boolean;
  showSorting: boolean;
}

export default class EmployeeDirectoryWebPart extends BaseClientSideWebPart<IEmployeeDirectoryWebPartProps> {

  private _employeeService!: EmployeeService;
  private _peoplePickerContext!: IPeoplePickerContext;

  public render(): void {
    const element: React.ReactElement<IEmployeeDirectoryProps> = React.createElement(
      EmployeeDirectory,
      {
        title: this.properties.title,
        showFilters: !!this.properties.showFilters,
        showSorting: !!this.properties.showSorting,
        employeeService: this._employeeService,
        peoplePickerContext: this._peoplePickerContext
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    const sp = spfi().using(SPFx(this.context));
    this._employeeService = new EmployeeService(sp);

    this._peoplePickerContext = {
      absoluteUrl: this.context.pageContext.web.absoluteUrl,
      msGraphClientFactory: this.context.msGraphClientFactory as unknown as IPeoplePickerContext['msGraphClientFactory'],
      spHttpClient: this.context.spHttpClient as unknown as IPeoplePickerContext['spHttpClient']
    };
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel,
                  description: strings.TitleFieldDescription
                })
              ]
            },
            {
              groupName: strings.DisplayGroupName,
              groupFields: [
                PropertyPaneToggle('showFilters', {
                  label: strings.ShowFiltersFieldLabel,
                  onText: strings.ToggleOnText,
                  offText: strings.ToggleOffText
                }),
                PropertyPaneToggle('showSorting', {
                  label: strings.ShowSortingFieldLabel,
                  onText: strings.ToggleOnText,
                  offText: strings.ToggleOffText
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
