import { ThemedComponent } from '../shared/theme-support/themed.component';
import { Home2PageComponent } from './home2-page.component';
import { Component } from '@angular/core';

@Component({
  selector: 'ds-themed-home2-page',
  styleUrls: [],
  templateUrl: '../shared/theme-support/themed.component.html',
})
export class ThemedHome2PageComponent extends ThemedComponent<Home2PageComponent> {

  protected getComponentName(): string {
    return 'Home2PageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/home-page/home-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./home2-page.component`);
  }

}
