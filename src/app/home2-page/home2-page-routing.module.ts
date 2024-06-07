import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Home2PageResolver } from './home2-page.resolver';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { ThemedHome2PageComponent } from './themed-home2-page.component';
import { MenuItemType } from '../shared/menu/menu-item-type.model';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ThemedHome2PageComponent,
        pathMatch: 'full',
        data: {
          title: 'home.title',
          menu: {
            public: [{
              id: 'statistics_site',
              active: true,
              visible: true,
              index: 2,
              model: {
                type: MenuItemType.LINK,
                text: 'menu.section.statistics',
                link: 'statistics',
              } as LinkMenuItemModel,
            }],
          },
        },
        resolve: {
          site: Home2PageResolver
        }
      }
    ])
  ],
  providers: [
    Home2PageResolver
  ]
})
export class Home2PageRoutingModule {
}
