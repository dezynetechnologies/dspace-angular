import { Component } from '@angular/core';
import { SEARCH_CONFIG_SERVICE } from '../my-dspace-page/my-dspace-page.component';
//import { SamvadAIConfigurationService } from '../core/shared/samvad-ai/samvad-ai/samvad-ai-configuration.service';

@Component({
  selector: 'ds-samvad-ai-page',
  templateUrl: './samvadAI-page.component.html',
  //providers: [
  //  {
  //    provide: SEARCH_CONFIG_SERVICE,
  //    useClass: SamvadAIConfigurationService
  //  }
  //]
})
/**
 * This component represents the whole search page
 * It renders samvad-ai results depending on the current samvad-ai options
 */
export class SamvadAIPageComponent {
}
