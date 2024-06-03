import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { ConfigurationSamvadAIPageGuard } from './configuration-samvadAI-page.guard';
import { StatisticsModule } from '../statistics/statistics.module';
import { SamvadAIPageComponent } from './samvadAI-page.component';
//import { SamvadAIFilterService } from '../core/shared/samvad-ai/samvad-ai/samvad-ai-filter.service';
//import { SamvadAIConfigurationService } from '../core/shared/samvad-ai/samvad-ai/samvad-ai-configuration.service';
import { JournalEntitiesModule } from '../entity-groups/journal-entities/journal-entities.module';
import { ResearchEntitiesModule } from '../entity-groups/research-entities/research-entities.module';
import { ThemedSamvadAIPageComponent } from './themed-samvadAI-page.component';
import { SamvadAIModule } from '../shared/samvad-ai/samvadAI.module';
import { SamvadAISearchPageComponent } from '../admin/samvad-ai-search-page/samvad-ai-search-page.component';

const components = [
  SamvadAIPageComponent,
  ThemedSamvadAIPageComponent
];

@NgModule({
  imports: [
    CommonModule,
    SamvadAIModule,
    SharedModule.withEntryComponents(),
    CoreModule.forRoot(),
    StatisticsModule.forRoot(),
    JournalEntitiesModule.withEntryComponents(),
    ResearchEntitiesModule.withEntryComponents()
  ],
  declarations: components,
  providers: [
    SidebarService,
  //  SamvadAIFilterService,
    ConfigurationSamvadAIPageGuard,
  //  SamvadAIConfigurationService
  ],
  exports: components
})

/**
 * This module handles all components and pipes that are necessary for the samvad-ai page
 */
export class SamvadAIPageModule {
}
