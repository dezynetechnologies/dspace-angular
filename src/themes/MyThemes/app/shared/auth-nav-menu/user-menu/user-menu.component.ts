import { Component } from '@angular/core';
import { UserMenuComponent as BaseComponent } from '../../../../../../app/shared/auth-nav-menu/user-menu/user-menu.component';
import { MYDASHBOARD_ROUTE } from '../../../my-dashboard/my-dashboard.component';
/**
 * Component representing the {@link UserMenuComponent} of a page
 */
@Component({
  selector: 'ds-user-menu',
  // templateUrl: 'user-menu.component.html',
  templateUrl: './user-menu.component.html',
  // styleUrls: ['user-menu.component.scss'],
  styleUrls: ['../../../../../../app/shared/auth-nav-menu/user-menu/user-menu.component.scss'],
})
export class UserMenuComponent extends BaseComponent {

  public mydashboardRoute = MYDASHBOARD_ROUTE;
}
