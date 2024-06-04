import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SamvadAISearchPageComponent } from './samvad-ai-search-page.component';
import { ItemAdminSearchResultListElementComponent } from './admin-search-results/admin-search-result-list-element/item-search-result/item-admin-search-result-list-element.component';
import { CommunityAdminSearchResultListElementComponent } from './admin-search-results/admin-search-result-list-element/community-search-result/community-admin-search-result-list-element.component';
import { CollectionAdminSearchResultListElementComponent } from './admin-search-results/admin-search-result-list-element/collection-search-result/collection-admin-search-result-list-element.component';
import { ItemAdminSearchResultGridElementComponent } from './admin-search-results/admin-search-result-grid-element/item-search-result/item-admin-search-result-grid-element.component';
import { CommunityAdminSearchResultGridElementComponent } from './admin-search-results/admin-search-result-grid-element/community-search-result/community-admin-search-result-grid-element.component';
import { CollectionAdminSearchResultGridElementComponent } from './admin-search-results/admin-search-result-grid-element/collection-search-result/collection-admin-search-result-grid-element.component';
import { ItemAdminSearchResultActionsComponent } from './admin-search-results/item-admin-search-result-actions.component';
import { JournalEntitiesModule } from '../../entity-groups/journal-entities/journal-entities.module';
import { ResearchEntitiesModule } from '../../entity-groups/research-entities/research-entities.module';
//import { SamvadAIModule } from '../../shared/samvad-ai/samvadAI.module';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { SamvadAIPageModule } from '../../samvad-ai-page/samvadAI-page.module';
import { ThemedSamvadAIPageComponent } from 'src/app/samvad-ai-page/themed-samvadAI-page.component';

const ENTRY_COMPONENTS = [
  // put only entry components that use custom decorator
  ItemAdminSearchResultListElementComponent,
  CommunityAdminSearchResultListElementComponent,
  CollectionAdminSearchResultListElementComponent,
  ItemAdminSearchResultGridElementComponent,
  CommunityAdminSearchResultGridElementComponent,
  CollectionAdminSearchResultGridElementComponent,
  ItemAdminSearchResultActionsComponent
];

@NgModule({
  imports: [
    FormsModule,
    CommonModule, 
    SharedModule.withEntryComponents(),
    JournalEntitiesModule.withEntryComponents(),
    ResearchEntitiesModule.withEntryComponents(),
    SamvadAIPageModule,
  ],
  declarations: [
    SamvadAISearchPageComponent,
    ...ENTRY_COMPONENTS
  ],
  providers:[
  ]
})
export class SamvadAISearchModule {
  /**
   * NOTE: this method allows to resolve issue with components that using a custom decorator
   * which are not loaded during SSR otherwise
   */
  static withEntryComponents() {
    return {
      ngModule: SharedModule,
      providers: ENTRY_COMPONENTS.map((component) => ({provide: component}))
    };
  }
}
