import { HostWindowService } from '../shared/host-window.service';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { SamvadAIComponent } from '../shared/samvad-ai/samvadAI.component';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { pushInOut } from '../shared/animations/push';
import { SEARCH_CONFIG_SERVICE } from '../my-dspace-page/my-dspace-page.component';
//import { SamvadAIConfigurationService } from '../core/shared/samvad-ai/samvad-ai-configuration.service';
import { RouteService } from '../core/services/route.service';
//import { SamvadAIService } from '../core/shared/samvad-ai/samvad-ai.service';
import { Router } from '@angular/router';
import { APP_CONFIG, AppConfig } from '../../config/app-config.interface';

/**
 * This component renders a samvad AI page using a configuration as input.
 */
@Component({
  selector: 'ds-configuration-samvad-ai-page',
  styleUrls: ['../shared/samvad-ai/samvadAI.component.scss'],
  templateUrl: '../shared/samvad-ai/samvadAI.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [pushInOut],
  //providers: [
  //  {
  //    provide: SEARCH_CONFIG_SERVICE,
  //    useClass: SamvadAIConfigurationService
  //  }
  //]
})

export class ConfigurationSamvadAIPageComponent extends SamvadAIComponent {
  constructor(//protected service: SamvadAIService,
              protected sidebarService: SidebarService,
              protected windowService: HostWindowService,
              //@Inject(SEARCH_CONFIG_SERVICE) public samvadAIConfigService: SamvadAIConfigurationService,
              protected routeService: RouteService,
              protected router: Router,
              @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    super();
  }
}
