import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HomeNewsComponent } from './home-news/home-news.component';
import { Home2PageRoutingModule } from './home2-page-routing.module';

import { Home2PageComponent } from './home2-page.component';
import { TopLevelCommunityListComponent } from './top-level-community-list/top-level-community-list.component';
import { StatisticsModule } from '../statistics/statistics.module';
import { ThemedHomeNewsComponent } from './home-news/themed-home-news.component';
import { ThemedHome2PageComponent } from './themed-home2-page.component';
import { RecentItemListComponent } from './recent-item-list/recent-item-list.component';
import { JournalEntitiesModule } from '../entity-groups/journal-entities/journal-entities.module';
import { ResearchEntitiesModule } from '../entity-groups/research-entities/research-entities.module';
import { ThemedTopLevelCommunityListComponent } from './top-level-community-list/themed-top-level-community-list.component';
import { LoginPageModule } from '../login-page/login-page.module';

const DECLARATIONS = [
  Home2PageComponent,
  ThemedHome2PageComponent,
  TopLevelCommunityListComponent,
  ThemedTopLevelCommunityListComponent,
  ThemedHomeNewsComponent,
  HomeNewsComponent,
  RecentItemListComponent
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule.withEntryComponents(),
    JournalEntitiesModule.withEntryComponents(),
    ResearchEntitiesModule.withEntryComponents(),
    Home2PageRoutingModule,
    LoginPageModule,
    StatisticsModule.forRoot()
  ],
  declarations: [
    ...DECLARATIONS,
  ],
  exports: [
    ...DECLARATIONS,
  ],
})
export class Home2PageModule {

}
