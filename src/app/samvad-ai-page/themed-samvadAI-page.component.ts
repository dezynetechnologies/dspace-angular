import { Component } from '@angular/core';
import { ThemedComponent } from '../shared/theme-support/themed.component';
import { SamvadAIPageComponent } from './samvadAI-page.component';
import { SamvadAISearchPageComponent } from '../admin/samvad-ai-search-page/samvad-ai-search-page.component';

/**
 * Themed wrapper for SamvadAIPageComponent
 */
@Component({
  selector: 'ds-themed-samvad-ai-page',
  styleUrls: [],
  templateUrl: '../shared/theme-support/themed.component.html',
})
export class ThemedSamvadAIPageComponent extends ThemedComponent<SamvadAIPageComponent> {

  protected getComponentName(): string {
    return 'SamvadAIPageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/search-page/search-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./samvadAI-page.component`);
  }
}
