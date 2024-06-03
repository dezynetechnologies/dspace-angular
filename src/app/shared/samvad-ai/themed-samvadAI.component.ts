import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemedComponent } from '../theme-support/themed.component';
import { SamvadAIComponent } from './samvadAI.component';
import { SearchConfigurationOption } from './samvadAI-switch-configuration/search-configuration-option.model';
import { Context } from '../../core/shared/context.model';
import { CollectionElementLinkType } from '../object-collection/collection-element-link.type';
import { SelectionConfig } from './samvadAI-results/search-results.component';
import { ViewMode } from '../../core/shared/view-mode.model';
import { SearchObjects } from './models/search-objects.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { ListableObject } from '../object-collection/shared/listable-object.model';

/**
 * Themed wrapper for {@link SamvadAIComponent}
 */
@Component({
  selector: 'ds-themed-samvad-ai',
  templateUrl: '../theme-support/themed.component.html',
})
export class ThemedSamvadAIComponent extends ThemedComponent<SamvadAIComponent> {
  // protected inAndOutputNames: (keyof SamvadAIComponent & keyof this)[] = [
  //   'configurationList',
  //   'context',
  //   'configuration',
  //   'fixedFilterQuery',
  //   'useCachedVersionIfAvailable',
  //   'inPlaceSearch',
  //   'linkType',
  //   'paginationId',
  //   'samvadAIEnabled',
  //   'sideBarWidth',
  //   'samvadAIFormPlaceholder',
  //   'selectable',
  //   'selectionConfig',
  //   'showCsvExport',
  //   'showSidebar',
  //   'showThumbnails',
  //   'showViewModes',
  //   'useUniquePageId',
  //   'viewModeList',
  //   'showScopeSelector',
  //   'trackStatistics',
  //   'query',
  //   'scope',
  //   'resultFound',
  //   'deselectObject',
  //   'selectObject',
  // ];

  // @Input() configurationList: SearchConfigurationOption[];

  // @Input() context: Context;

  // @Input() configuration: string;

  // @Input() fixedFilterQuery: string;

  // @Input() useCachedVersionIfAvailable: boolean;

  // @Input() inPlaceSearch: boolean;

  // @Input() linkType: CollectionElementLinkType;

  // @Input() paginationId: string;

  // @Input() samvadAIEnabled: boolean;

  // @Input() sideBarWidth: number;

  // @Input() samvadAIFormPlaceholder: string;

  // @Input() selectable: boolean;

  // @Input() selectionConfig: SelectionConfig;

  // @Input() showCsvExport: boolean;

  // @Input() showSidebar: boolean;

  // @Input() showThumbnails: boolean;

  // @Input() showViewModes: boolean;

  // @Input() useUniquePageId: boolean;

  // @Input() viewModeList: ViewMode[];

  // @Input() showScopeSelector: boolean;

  // @Input() trackStatistics: boolean;

  // @Input() query: string;

  // @Input() scope: string;

  // @Output() resultFound: EventEmitter<SearchObjects<DSpaceObject>> = new EventEmitter();

  // @Output() deselectObject: EventEmitter<ListableObject> = new EventEmitter();

  // @Output() selectObject: EventEmitter<ListableObject> = new EventEmitter();

  protected getComponentName(): string {
    return 'SamvadAIComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/shared/search/search.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./samvadAI.component');
  }
}
