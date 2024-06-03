import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { configureSamvadAIComponentTestingModule } from '../shared/samvad-ai/samvadAI.component.spec';
import { ConfigurationSamvadAIPageComponent } from './configuration-samvadAI-page.component';
//import { SamvadAIConfigurationService } from '../core/shared/samvad-ai/samvad-ai-configuration.service';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RouteService } from '../core/services/route.service';
import createSpy = jasmine.createSpy;

const CONFIGURATION = 'test-configuration';
const QUERY = 'test query';

@Component({
  template: `
    <ds-configuration-samvad-ai-page [configuration]="'${CONFIGURATION}'"
                                  [fixedFilterQuery]="'${QUERY}'"
                                  #configurationSamvadAIPage>
    </ds-configuration-samvad-ai-page>
  `,
})
class HostComponent {
  @ViewChild('configurationSamvadAIPage') configurationSamvadAIPage: ConfigurationSamvadAIPageComponent;
}

describe('ConfigurationSamvadAIPageComponent', () => {
  let comp: ConfigurationSamvadAIPageComponent;
  let fixture: ComponentFixture<HostComponent>;
  //let samvadAIConfigService: SamvadAIConfigurationService;
  let routeService: RouteService;

  beforeEach(waitForAsync(() => {
    configureSamvadAIComponentTestingModule(ConfigurationSamvadAIPageComponent, [HostComponent]);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);

    // Set router url to a dummy value for SamvadAIComponent#ngOnInit
    spyOnProperty(TestBed.inject(Router), 'url', 'get').and.returnValue('some/url/here');

    routeService = TestBed.inject(RouteService);
    routeService.setParameter = createSpy('setParameter');

    fixture.detectChanges();

    comp = fixture.componentInstance.configurationSamvadAIPage;
    //samvadAIConfigService = (comp as any).samvadAIConfigService;
  });

  it('should set route parameters on init', () => {
    //expect(comp.configuration).toBe(CONFIGURATION);
    //expect(comp.fixedFilterQuery).toBe(QUERY);

    expect(routeService.setParameter).toHaveBeenCalledWith('configuration', CONFIGURATION);
    expect(routeService.setParameter).toHaveBeenCalledWith('fixedFilterQuery', QUERY);
  });

});
