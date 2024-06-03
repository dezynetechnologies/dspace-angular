import { Component, Input } from '@angular/core';
import { ThemedComponent } from '../shared/theme-support/themed.component';
import { ConfigurationSamvadAIPageComponent } from './configuration-samvadAI-page.component';
import { Observable } from 'rxjs';
import { Context } from '../core/shared/context.model';

/**
 * Themed wrapper for ConfigurationSamvadAIPageComponent
 */
@Component({
  selector: 'ds-themed-configuration-samvad-ai-page',
  styleUrls: [],
  templateUrl: '../shared/theme-support/themed.component.html',
})
export class ThemedConfigurationSamvadAIPageComponent extends ThemedComponent<ConfigurationSamvadAIPageComponent> {
  /**
   * The configuration to use for the samvad AI options
   * If empty, the configuration will be determined by the route parameter called 'configuration'
   */
  @Input() configuration: string;

  /**
   * The actual query for the fixed filter.
   * If empty, the query will be determined by the route parameter called 'filter'
   */
  @Input() fixedFilterQuery: string;

  /**
   * True when the samvad AI component should show results on the current page
   */
  @Input() inPlaceSearch: boolean;

  /**
   * Whether or not the samvad AI bar should be visible
   */
  @Input() samvadAIEnabled: boolean;

  /**
   * The width of the sidebar (bootstrap columns)
   */
  @Input()
  sideBarWidth: number;

  /**
   * The currently applied configuration (determines title of samvad AI)
   */
  @Input()
  configuration$: Observable<string>;

  /**
   * The current context
   */
  @Input()
  context: Context;

  //protected inAndOutputNames: (keyof ConfigurationSamvadAIPageComponent & keyof this)[] =
  //  ['context', 'configuration', 'fixedFilterQuery', 'inPlaceSearch', 'samvadAIEnabled', 'sideBarWidth'];

  protected getComponentName(): string {
    return 'ConfigurationSamvadAIPageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/search-page/configuration-search-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./configuration-samvadAI-page.component');
  }

}
