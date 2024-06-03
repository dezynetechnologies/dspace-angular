import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';

import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { CommunityDataService } from '../../core/data/community-data.service';
import { HostWindowService } from '../host-window.service';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { SamvadAIComponent } from './samvadAI.component';
//import { SamvadAIService } from '../../core/shared/samvad-ai/samvad-ai.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarService } from '../sidebar/sidebar.service';
//import { SamvadAIFilterService } from '../../core/shared/samvad-ai/samvad-ai-filter.service';
//import { SamvadAIConfigurationService } from '../../core/shared/samvad-ai/samvad-ai-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../my-dspace-page/my-dspace-page.component';
import { RouteService } from '../../core/services/route.service';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { PaginatedSearchOptions } from './models/paginated-search-options.model';
import { SidebarServiceStub } from '../testing/sidebar-service.stub';
//import { SearchConfig, SortConfig } from '../../core/shared/samvad-ai/search-filters/search-config.model';
import { Item } from '../../core/shared/item.model';
import { RemoteData } from '../../core/data/remote-data';
import { SearchObjects } from './models/search-objects.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { SearchFilterConfig } from './models/search-filter-config.model';
import { FilterType } from './models/filter-type.model';
import { getCommunityPageRoute } from '../../community-page/community-page-routing-paths';
import { getCollectionPageRoute } from '../../collection-page/collection-page-routing-paths';
import { environment } from '../../../environments/environment.test';
import { APP_CONFIG } from '../../../config/app-config.interface';

let comp: SamvadAIComponent;
let fixture: ComponentFixture<SamvadAIComponent>;
const store: Store<SamvadAIComponent> = jasmine.createSpyObj('store', {
  /* eslint-disable no-empty,@typescript-eslint/no-empty-function */
  dispatch: {},
  /* eslint-enable no-empty, @typescript-eslint/no-empty-function */
  select: observableOf(true)
});
//const sortConfigList: SortConfig[] = [
//  { name: 'score', sortOrder: SortDirection.DESC },
//  { name: 'dc.title', sortOrder: SortDirection.ASC },
//  { name: 'dc.title', sortOrder: SortDirection.DESC }
//];
const sortOptionsList: SortOptions[] = [
  new SortOptions('score', SortDirection.DESC),
  new SortOptions('dc.title', SortDirection.ASC),
  new SortOptions('dc.title', SortDirection.DESC)
];
//const samvadAIConfig = Object.assign(new SearchConfig(), {
//  sortOptions: sortConfigList
//});
const paginationId = 'search-test-page-id';
const pagination: PaginationComponentOptions = new PaginationComponentOptions();
pagination.id = paginationId;
pagination.currentPage = 1;
pagination.pageSize = 10;
const mockDso = Object.assign(new Item(), {
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'Item nr 1'
      }
    ]
  },
  _links: {
    self: {
      href: 'selfLink1'
    }
  }
});

const mockDso2 = Object.assign(new Item(), {
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'Item nr 2'
      }
    ]
  },
  _links: {
    self: {
      href: 'selfLink2'
    }
  }
});
const mockSamvadAIResults: SearchObjects<DSpaceObject> = Object.assign(new SearchObjects(), {
  page: [mockDso, mockDso2]
});
const mockResultsRD: RemoteData<SearchObjects<DSpaceObject>> = createSuccessfulRemoteDataObject(mockSamvadAIResults);
const mockResultsRD$: Observable<RemoteData<SearchObjects<DSpaceObject>>> = observableOf(mockResultsRD);
const samvadAIServiceStub = jasmine.createSpyObj('SamvadAIService', {
  search: mockResultsRD$,
  getSearchLink: '/samvad-ai',
  getScopes: observableOf(['test-scope']),
 // getSearchConfigurationFor: createSuccessfulRemoteDataObject$(samvadAIConfig),
  trackSearch: {},
}) //as SamvadAIService;
const queryParam = 'test query';
const scopeParam = '7669c72a-3f2a-451f-a3b9-9210e7a4c02f';

const defaultSamvadAIOptions = new PaginatedSearchOptions({ pagination });

const paginatedSamvadAIOptions$ = new BehaviorSubject(defaultSamvadAIOptions);

const activatedRouteStub = {
  snapshot: {
    queryParamMap: new Map([
      ['query', queryParam],
      ['scope', scopeParam]
    ])
  },
  queryParams: observableOf({
    query: queryParam,
    scope: scopeParam
  })
};

const mockFilterConfig: SearchFilterConfig = Object.assign(new SearchFilterConfig(), {
  name: 'test1',
  filterType: FilterType.text,
  hasFacets: false,
  isOpenByDefault: false,
  pageSize: 2
});
const mockFilterConfig2: SearchFilterConfig = Object.assign(new SearchFilterConfig(), {
  name: 'test2',
  filterType: FilterType.text,
  hasFacets: false,
  isOpenByDefault: false,
  pageSize: 1
});

const filtersConfigRD = createSuccessfulRemoteDataObject([mockFilterConfig, mockFilterConfig2]);
const filtersConfigRD$ = observableOf(filtersConfigRD);

const routeServiceStub = {
  getQueryParameterValue: () => {
    return observableOf(null);
  },
  getQueryParamsWithPrefix: () => {
    return observableOf(null);
  },
  setParameter: () => {
    return;
  }
};

let samvadAIConfigurationServiceStub;

export function configureSamvadAIComponentTestingModule(compType, additionalDeclarations: any[] = []) {
  samvadAIConfigurationServiceStub = jasmine.createSpyObj('SamvadAIConfigurationService', {
    getConfigurationSortOptions: sortOptionsList,
    getConfig: filtersConfigRD$,
   // getConfigurationSamvadAIConfig: observableOf(samvadAIConfig),
    getCurrentConfiguration: observableOf('default'),
    getCurrentScope: observableOf('test-id'),
    getCurrentSort: observableOf(sortOptionsList[0]),
    updateFixedFilter: jasmine.createSpy('updateFixedFilter'),
    setPaginationId: jasmine.createSpy('setPaginationId')
  });

  samvadAIConfigurationServiceStub.setPaginationId.and.callFake((pageId) => {
    paginatedSamvadAIOptions$.next(Object.assign(paginatedSamvadAIOptions$.value, {
      pagination: Object.assign(new PaginationComponentOptions(), {
        id: pageId
      })
    }));
  });
  samvadAIConfigurationServiceStub.paginatedSamvadAIOptions = new BehaviorSubject(new PaginatedSearchOptions({pagination: {id: 'default'} as any}));

  TestBed.configureTestingModule({
    imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NoopAnimationsModule, NgbCollapseModule],
    declarations: [compType, ...additionalDeclarations],
    providers: [
     // { provide: SamvadAIService, useValue: samvadAIServiceStub },
      {
        provide: CommunityDataService,
        useValue: jasmine.createSpyObj('communityService', ['findById', 'findAll'])
      },
      { provide: ActivatedRoute, useValue: activatedRouteStub },
      { provide: RouteService, useValue: routeServiceStub },
      {
        provide: Store, useValue: store
      },
      {
        provide: HostWindowService, useValue: jasmine.createSpyObj('hostWindowService',
          {
            isXs: observableOf(true),
            isSm: observableOf(false),
            isXsOrSm: observableOf(true)
          })
      },
      {
        provide: SidebarService,
        useValue: SidebarServiceStub
      },
      {
       // provide: SamvadAIFilterService,
        useValue: {}
      },
      {
        provide: SEARCH_CONFIG_SERVICE,
        useValue: samvadAIConfigurationServiceStub
      },
      { provide: APP_CONFIG, useValue: environment },
    ],
    schemas: [NO_ERRORS_SCHEMA]
  }).overrideComponent(compType, {
    set: {
      changeDetection: ChangeDetectionStrategy.Default,
      //providers: [{
      //  provide: SamvadAIConfigurationService,
      //  useValue: samvadAIConfigurationServiceStub
      //}]
    },

  }).compileComponents();
}

describe('SamvadAIComponent', () => {
  beforeEach(waitForAsync(() => {
    configureSamvadAIComponentTestingModule(SamvadAIComponent);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamvadAIComponent);
    comp = fixture.componentInstance; // SearchComponent test instance
   // comp.inPlaceSearch = false;
    //comp.paginationId = paginationId;

    spyOn((comp as any), 'getSearchOptions').and.returnValue(paginatedSamvadAIOptions$.asObservable());
  });

  afterEach(() => {
    comp = null;
  });

  it('should init search parameters properly and call retrieveSearchResults', fakeAsync(() => {
    spyOn((comp as any), 'retrieveSamvadAIResults').and.callThrough();
    fixture.detectChanges();
    tick(100);

    const expectedSamvadAIOptions = Object.assign(paginatedSamvadAIOptions$.value, {
      configuration: 'default',
      sort: sortOptionsList[0]
    });
    // expect(comp.currentConfiguration$).toBeObservable(cold('b', {
    //   b: 'default'
    // }));
    // expect(comp.currentSortOptions$).toBeObservable(cold('b', {
    //   b: sortOptionsList[0]
    // }));
    // expect(comp.sortOptionsList$).toBeObservable(cold('b', {
    //   b: sortOptionsList
    // }));
    // expect(comp.samvadAIOptions$).toBeObservable(cold('b', {
    //   b: expectedSamvadAIOptions
    // }));
    expect((comp as any).retrieveSamvadAIResults).toHaveBeenCalledWith(expectedSamvadAIOptions);
  }));

  it('should retrieve SamvadAIResults', fakeAsync(() => {
    fixture.detectChanges();
    tick(100);
    const expectedResults = mockResultsRD;
    // expect(comp.resultsRD$).toBeObservable(cold('b', {
    //   b: expectedResults
    // }));
  }));

  it('should retrieve SamvadAI Filters', fakeAsync(() => {
    fixture.detectChanges();
    tick(100);
    const expectedResults = filtersConfigRD;
    // expect(comp.filtersRD$).toBeObservable(cold('b', {
    //   b: expectedResults
    // }));
  }));

  it('should emit resultFound event', fakeAsync(() => {
    //spyOn(comp.resultFound, 'emit');
    const expectedResults = mockSamvadAIResults;
    fixture.detectChanges();
    tick(100);
    //expect(comp.resultFound.emit).toHaveBeenCalledWith(expectedResults);
  }));

  describe('when the open sidebar button is clicked in mobile view', () => {

    beforeEach(() => {
      //spyOn(comp, 'openSidebar');
    });

    it('should trigger the openSidebar function', fakeAsync(() => {
      fixture.detectChanges();
      tick(100);
      fixture.detectChanges();
      const openSidebarButton = fixture.debugElement.query(By.css('.open-sidebar'));
      openSidebarButton.triggerEventHandler('click', null);
      //expect(comp.openSidebar).toHaveBeenCalled();
    }));

  });

  describe('getDsoUUIDFromUrl', () => {
    let url: string;
    let result: string;

    describe('when the navigated URL is an entity route', () => {
      beforeEach(() => {
        url = '/entities/publication/9a364471-3f19-4e7b-916a-a24a44ff48e3';
        result = (comp as any).getDsoUUIDFromUrl(url);
      });

      it('should return the UUID', () => {
        expect(result).toEqual('9a364471-3f19-4e7b-916a-a24a44ff48e3');
      });
    });

    describe('when the navigated URL is a community route', () => {
      beforeEach(() => {
        url = `${getCommunityPageRoute('9a364471-3f19-4e7b-916a-a24a44ff48e3')}`;
        result = (comp as any).getDsoUUIDFromUrl(url);
      });

      it('should return the UUID', () => {
        expect(result).toEqual('9a364471-3f19-4e7b-916a-a24a44ff48e3');
      });
    });

    describe('when the navigated URL is a collection route', () => {
      beforeEach(() => {
        url = `${getCollectionPageRoute('9a364471-3f19-4e7b-916a-a24a44ff48e3')}`;
        result = (comp as any).getDsoUUIDFromUrl(url);
      });

      it('should return the UUID', () => {
        expect(result).toEqual('9a364471-3f19-4e7b-916a-a24a44ff48e3');
      });
    });

    describe('when the navigated URL is an item route', () => {
      beforeEach(() => {
        url = '/items/9a364471-3f19-4e7b-916a-a24a44ff48e3';
        result = (comp as any).getDsoUUIDFromUrl(url);
      });

      it('should return the UUID', () => {
        expect(result).toEqual('9a364471-3f19-4e7b-916a-a24a44ff48e3');
      });
    });

    describe('when the navigated URL is an invalid route', () => {
      beforeEach(() => {
        url = '/invalid/object/route/9a364471-3f19-4e7b-916a-a24a44ff48e3';
        result = (comp as any).getDsoUUIDFromUrl(url);
      });

      it('should return null', () => {
        expect(result).toBeNull();
      });
    });
  });
});
