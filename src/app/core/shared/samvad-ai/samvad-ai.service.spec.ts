import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SamvadAIService } from './samvad-ai.service';
import { Router, UrlTree } from '@angular/router';
import { RequestService } from '../../data/request.service';
import { ActivatedRouteStub } from '../../../shared/testing/active-router.stub';
import { RouterStub } from '../../../shared/testing/router.stub';
import { HALEndpointService } from '../hal-endpoint.service';
import { combineLatest as observableCombineLatest, Observable, of as observableOf } from 'rxjs';
import { PaginatedSearchOptions } from '../../../shared/samvad-ai/models/paginated-search-options.model';
import { RemoteData } from '../../data/remote-data';
import { getMockRequestService } from '../../../shared/mocks/request.service.mock';
import { CommunityDataService } from '../../data/community-data.service';
import { ViewMode } from '../view-mode.model';
import { DSpaceObjectDataService } from '../../data/dspace-object-data.service';
import { map } from 'rxjs/operators';
import { RouteService } from '../../services/route.service';
import { routeServiceStub } from '../../../shared/testing/route-service.stub';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { SearchObjects } from '../../../shared/samvad-ai/models/search-objects.model';
import { PaginationService } from '../../pagination/pagination.service';
import { SamvadAIConfigurationService } from './samvad-ai-configuration.service';
import { PaginationServiceStub } from '../../../shared/testing/pagination-service.stub';
import { RequestEntry } from '../../data/request-entry.model';
import { Angulartics2 } from 'angulartics2';
import { SearchFilterConfig } from '../../../shared/samvad-ai/models/search-filter-config.model';
import anything = jasmine.anything;

@Component({ template: '' })
class DummyComponent {
}

describe('SamvadAIService', () => {
  describe('By default', () => {
    let samvadAIService: SamvadAIService;
    const router = new RouterStub();
    const route = new ActivatedRouteStub();
    const samvadAIConfigService = { paginationID: 'page-id' };
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          RouterTestingModule.withRoutes([
            { path: 'samvad-ai', component: DummyComponent, pathMatch: 'full' },
          ])
        ],
        declarations: [
          DummyComponent
        ],
        providers: [
          { provide: Router, useValue: router },
          { provide: RouteService, useValue: routeServiceStub },
          { provide: RequestService, useValue: getMockRequestService() },
          { provide: RemoteDataBuildService, useValue: {} },
          { provide: HALEndpointService, useValue: {} },
          { provide: CommunityDataService, useValue: {} },
          { provide: DSpaceObjectDataService, useValue: {} },
          { provide: PaginationService, useValue: {} },
          { provide: SamvadAIConfigurationService, useValue: samvadAIConfigService },
          { provide: Angulartics2, useValue: {} },
          SamvadAIService
        ],
      });
      samvadAIService = TestBed.inject(SamvadAIService);
    });

    it('should return list view mode', () => {
      samvadAIService.getViewMode().subscribe((viewMode) => {
        expect(viewMode).toBe(ViewMode.ListElement);
      });
    });
  });
  describe('', () => {
    let samvadAIService: SamvadAIService;
    const router = new RouterStub();
    let routeService;

    const halService = {
      /* eslint-disable no-empty,@typescript-eslint/no-empty-function */
      getEndpoint: () => {
      }
      /* eslint-enable no-empty,@typescript-eslint/no-empty-function */

    };

    const remoteDataBuildService = {
      toRemoteDataObservable: (requestEntryObs: Observable<RequestEntry>, payloadObs: Observable<any>) => {
        return observableCombineLatest([requestEntryObs, payloadObs]).pipe(
          map(([req, pay]) => {
            return { req, pay };
          })
        );
      },
      aggregate: (input: Observable<RemoteData<any>>[]): Observable<RemoteData<any[]>> => {
        return createSuccessfulRemoteDataObject$([]);
      },
      buildFromHref: (href: string): Observable<RemoteData<any>> => {
        return createSuccessfulRemoteDataObject$(Object.assign(new SearchObjects(), {
          page: []
        }));
      }
    };

    const paginationService = new PaginationServiceStub();
    const samvadAIConfigService = { paginationID: 'page-id' };
    const requestService = getMockRequestService();

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          RouterTestingModule.withRoutes([
            { path: 'samvad-ai', component: DummyComponent, pathMatch: 'full' },
          ])
        ],
        declarations: [
          DummyComponent
        ],
        providers: [
          { provide: Router, useValue: router },
          { provide: RouteService, useValue: routeServiceStub },
          { provide: RequestService, useValue: requestService },
          { provide: RemoteDataBuildService, useValue: remoteDataBuildService },
          { provide: HALEndpointService, useValue: halService },
          { provide: CommunityDataService, useValue: {} },
          { provide: DSpaceObjectDataService, useValue: {} },
          { provide: PaginationService, useValue: paginationService },
          { provide: SamvadAIConfigurationService, useValue: samvadAIConfigService },
          { provide: Angulartics2, useValue: {} },
          SamvadAIService
        ],
      });
      samvadAIService = TestBed.inject(SamvadAIService);
      routeService = TestBed.inject(RouteService);
      const urlTree = Object.assign(new UrlTree(), { root: { children: { primary: 'samvad-ai' } } });
      router.parseUrl.and.returnValue(urlTree);
    });

    it('should call the navigate method on the Router with view mode list parameter as a parameter when setViewMode is called', () => {
      samvadAIService.setViewMode(ViewMode.ListElement);
      expect(paginationService.updateRouteWithUrl).toHaveBeenCalledWith('page-id', ['/samvad-ai'], { page: 1 }, { view: ViewMode.ListElement }
      );
    });

    it('should call the navigate method on the Router with view mode grid parameter as a parameter when setViewMode is called', () => {
      samvadAIService.setViewMode(ViewMode.GridElement);
      expect(paginationService.updateRouteWithUrl).toHaveBeenCalledWith('page-id', ['/samvad-ai'], { page: 1 }, { view: ViewMode.GridElement }
      );
    });

    it('should return ViewMode.List when the viewMode is set to ViewMode.List in the ActivatedRoute', () => {
      let viewMode = ViewMode.GridElement;
      spyOn(routeService, 'getQueryParamMap').and.returnValue(observableOf(new Map([
        ['view', ViewMode.ListElement],
      ])));

      samvadAIService.getViewMode().subscribe((mode) => viewMode = mode);
      expect(viewMode).toEqual(ViewMode.ListElement);
    });

    it('should return ViewMode.Grid when the viewMode is set to ViewMode.Grid in the ActivatedRoute', () => {
      let viewMode = ViewMode.ListElement;
      spyOn(routeService, 'getQueryParamMap').and.returnValue(observableOf(new Map([
        ['view', ViewMode.GridElement],
      ])));
      samvadAIService.getViewMode().subscribe((mode) => viewMode = mode);
      expect(viewMode).toEqual(ViewMode.GridElement);
    });

    describe('when samvad-ai is called', () => {
      const endPoint = 'http://endpoint.com/test/test';
      const samvadAIOptions = new PaginatedSearchOptions({});
      beforeEach(() => {
        spyOn((samvadAIService as any).halService, 'getEndpoint').and.returnValue(observableOf(endPoint));
        spyOn((samvadAIService as any).rdb, 'buildFromHref').and.callThrough();
        /* eslint-disable no-empty,@typescript-eslint/no-empty-function */
        samvadAIService.search(samvadAIOptions).subscribe((t) => {
        }); // subscribe to make sure all methods are called
        /* eslint-enable no-empty,@typescript-eslint/no-empty-function */
      });

      it('should call getEndpoint on the halService', () => {
        expect((samvadAIService as any).halService.getEndpoint).toHaveBeenCalled();
      });

      it('should send out the request on the request service', () => {
        expect((samvadAIService as any).requestService.send).toHaveBeenCalled();
      });

      it('should call getByHref on the request service with the correct request url', () => {
        expect((samvadAIService as any).rdb.buildFromHref).toHaveBeenCalledWith(endPoint);
      });
    });

    describe('when getFacetValuesFor is called with a filterQuery', () => {
      it('should add the encoded filterQuery to the args list', () => {
        jasmine.getEnv().allowRespy(true);
        const spyRequest = spyOn((samvadAIService as any), 'request').and.stub();
        spyOn(requestService, 'send').and.returnValue(true);
        const samvadAIFilterConfig = new SearchFilterConfig();
        samvadAIFilterConfig._links = {
          self: {
            href: 'https://demo.dspace.org/',
          },
        };

        samvadAIService.getFacetValuesFor(samvadAIFilterConfig, 1, undefined, 'filter&Query');

        expect(spyRequest).toHaveBeenCalledWith(anything(), 'https://demo.dspace.org?page=0&size=5&prefix=filter%26Query');
      });
    });
  });
});
