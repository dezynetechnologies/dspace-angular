import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchSwitchConfigurationComponent } from './samvadAI-switch-configuration/search-switch-configuration.component';
import { SearchFiltersComponent } from './samvadAI-filters/search-filters.component';
import { SearchFilterComponent } from './samvadAI-filters/search-filter/search-filter.component';
import { SearchFacetFilterComponent } from './samvadAI-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { SearchLabelsComponent } from './samvadAI-labels/search-labels.component';
import { SearchLabelComponent } from './samvadAI-labels/search-label/search-label.component';
import { SearchFacetFilterWrapperComponent } from './samvadAI-filters/search-filter/search-facet-filter-wrapper/search-facet-filter-wrapper.component';
import { SearchRangeFilterComponent } from './samvadAI-filters/search-filter/search-range-filter/search-range-filter.component';
import { SearchTextFilterComponent } from './samvadAI-filters/search-filter/search-text-filter/search-text-filter.component';
import { SearchHierarchyFilterComponent } from './samvadAI-filters/search-filter/search-hierarchy-filter/search-hierarchy-filter.component';
import { SearchBooleanFilterComponent } from './samvadAI-filters/search-filter/search-boolean-filter/search-boolean-filter.component';
import { SearchFacetOptionComponent } from './samvadAI-filters/search-filter/search-facet-filter-options/search-facet-option/search-facet-option.component';
import { SearchFacetSelectedOptionComponent } from './samvadAI-filters/search-filter/search-facet-filter-options/search-facet-selected-option/search-facet-selected-option.component';
import { SearchFacetRangeOptionComponent } from './samvadAI-filters/search-filter/search-facet-filter-options/search-facet-range-option/search-facet-range-option.component';
import { SearchAuthorityFilterComponent } from './samvadAI-filters/search-filter/search-authority-filter/search-authority-filter.component';
import { SearchSidebarComponent } from './samvadAI-sidebar/search-sidebar.component';
import { SearchSettingsComponent } from './samvadAI-settings/search-settings.component';
import { ConfigurationSamvadAIPageComponent } from '../../samvad-ai-page/configuration-samvadAI-page.component';
import { ThemedConfigurationSamvadAIPageComponent } from '../../samvad-ai-page/themed-configuration-samvadAI-page.component';
import { SearchObjects } from './models/search-objects.model';
import { FacetConfigResponse } from './models/facet-config-response.model';
import { FacetValues } from './models/facet-values.model';
import { SearchResult } from './models/search-result.model';
import { MissingTranslationHandler, TranslateModule } from '@ngx-translate/core';
import { MissingTranslationHelper } from '../translate/missing-translation.helper';
import { SharedModule } from '../shared.module';
import { SearchResultsComponent } from './samvadAI-results/search-results.component';
import { SamvadAIComponent } from './samvadAI.component';
import { ThemedSamvadAIComponent } from './themed-samvadAI.component';
import { ThemedSearchResultsComponent } from './samvadAI-results/themed-search-results.component';
import { ThemedSearchSettingsComponent } from './samvadAI-settings/themed-search-settings.component';
import { NouisliderModule } from 'ng2-nouislider';
import { ThemedSearchFiltersComponent } from './samvadAI-filters/themed-search-filters.component';
import { ThemedSearchSidebarComponent } from './samvadAI-sidebar/themed-search-sidebar.component';
import { SamvadAIService } from 'src/app/core/shared/samvad-ai/samvad-ai.service'; 
import { FormsModule } from '@angular/forms';
import { CommunityListService } from 'src/app/community-list-page/community-list-service';
import { CommunityDropdownComponent } from 'src/themes/MyThemes/app/community-dropdown/community-dropdown.component';
import { CommunityListPageModule } from 'src/app/community-list-page/community-list-page.module';

const COMPONENTS = [
  SamvadAIComponent,
  ThemedSamvadAIComponent,
  SearchResultsComponent,
  SearchSidebarComponent,
  SearchSettingsComponent,
  SearchFiltersComponent,
  SearchFilterComponent,
  SearchFacetFilterComponent,
  SearchLabelsComponent,
  SearchLabelComponent,
  SearchFacetFilterWrapperComponent,
  SearchRangeFilterComponent,
  SearchTextFilterComponent,
  SearchHierarchyFilterComponent,
  SearchBooleanFilterComponent,
  SearchFacetOptionComponent,
  SearchFacetSelectedOptionComponent,
  SearchFacetRangeOptionComponent,
  SearchAuthorityFilterComponent,
  SearchSwitchConfigurationComponent,
  ConfigurationSamvadAIPageComponent,
  ThemedConfigurationSamvadAIPageComponent,
  ThemedSearchResultsComponent,
  ThemedSearchSettingsComponent,
  ThemedSearchFiltersComponent,
  ThemedSearchSidebarComponent,
  CommunityDropdownComponent
];

const ENTRY_COMPONENTS = [
  SearchFacetFilterComponent,
  SearchRangeFilterComponent,
  SearchTextFilterComponent,
  SearchHierarchyFilterComponent,
  SearchBooleanFilterComponent,
  SearchFacetOptionComponent,
  SearchFacetSelectedOptionComponent,
  SearchFacetRangeOptionComponent,
  SearchAuthorityFilterComponent
];

/**
 * Declaration needed to make sure all decorator functions are called in time
 */
export const MODELS = [
  SearchObjects,
  FacetConfigResponse,
  FacetValues,
  SearchResult
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild({
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MissingTranslationHelper },
      useDefaultLang: true
    }),
    SharedModule.withEntryComponents(),
    NouisliderModule,
    FormsModule,
    CommunityListPageModule
  ],
  providers: [
      SamvadAIService,
      CommunityListService
    ],
  exports: [
    ...COMPONENTS
  ]
})
export class SamvadAIModule {
  /**
   * NOTE: this method allows to resolve issue with components that using a custom decorator
   * which are not loaded during SSR otherwise
   */
  static withEntryComponents() {
    return {
      ngModule: SamvadAIModule,
      providers: ENTRY_COMPONENTS.map((component) => ({ provide: component }))
    };
  }
}
