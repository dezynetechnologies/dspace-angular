import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ConfigurationSamvadAIPageGuard } from './configuration-samvadAI-page.guard';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { I18nBreadcrumbsService } from '../core/breadcrumbs/i18n-breadcrumbs.service';
import { SamvadAIPageModule } from './samvadAI-page.module';
import { ThemedSamvadAIPageComponent } from './themed-samvadAI-page.component';
import { ThemedConfigurationSamvadAIPageComponent } from './themed-configuration-samvadAI-page.component';

@NgModule({
  imports: [
    SamvadAIPageModule,
    RouterModule.forChild([{
        path: '',
        resolve: { breadcrumb: I18nBreadcrumbResolver }, data: { title: 'search.title', breadcrumbKey: 'search' },
        children: [
          { path: '', component: ThemedSamvadAIPageComponent },
          { path: ':configuration', component: ThemedConfigurationSamvadAIPageComponent, canActivate: [ConfigurationSamvadAIPageGuard] }
        ]
      }]
    )
  ],
  providers: [
    I18nBreadcrumbResolver,
    I18nBreadcrumbsService
  ]
})
export class SamvadAIPageRoutingModule {
}
