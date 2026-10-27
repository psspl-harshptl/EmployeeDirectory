import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { spfi, SPFx } from '@pnp/sp';

import * as strings from 'EmployeeDirectoryWebPartStrings';
import EmployeeDirectory from './components/EmployeeDirectory';
import { IEmployeeDirectoryProps } from './components/IEmployeeDirectoryProps';
import { EmployeeService } from './services/EmployeeService';

export interface IEmployeeDirectoryWebPartProps {
  title: string;
}

export default class EmployeeDirectoryWebPart extends BaseClientSideWebPart<IEmployeeDirectoryWebPartProps> {

  private _employeeService!: EmployeeService;

  public render(): void {
    const element: React.ReactElement<IEmployeeDirectoryProps> = React.createElement(
      EmployeeDirectory,
      {
        title: this.properties.title,
        employeeService: this._employeeService
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    // Create the PnPjs instance once, bound to this web part's SharePoint context.
    const sp = spfi().using(SPFx(this.context));
    this._employeeService = new EmployeeService(sp);
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
            }
          ]
        }
      ]
    };
  }
}
