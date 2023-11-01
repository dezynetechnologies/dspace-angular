import { Item } from '../../../../core/shared/item.model';
import { JournalVolumeGridElementComponent } from './journal-volume-grid-element.component';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { buildPaginatedList } from '../../../../core/data/paginated-list.model';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { of as observableOf } from 'rxjs';
import { waitForAsync, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { DSONameServiceMock } from '../../../../shared/mocks/dso-name.service.mock';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../../../shared/testing/active-router.stub';
import { ThemeService } from '../../../../shared/theme-support/theme.service';
import { getMockThemeService } from '../../../../shared/mocks/theme-service.mock';
import { AuthService } from '../../../../core/auth/auth.service';
import { AuthServiceMock } from '../../../../shared/mocks/auth.service.mock';
import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';

const mockItem = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'creativework.datePublished': [
      {
        language: null,
        value: '2015-06-26'
      }
    ],
    'dc.description': [
      {
        language: 'en_US',
        value: 'A description for the journal volume'
      }
    ]
  }
});

describe('JournalVolumeGridElementComponent', () => {
  let comp;
  let fixture;

  const truncatableServiceStub: any = {
    isCollapsed: (id: number) => observableOf(true),
    expand: (id: number) => null,
    collapse: (id: number) => null
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, JournalVolumeGridElementComponent, TruncatePipe, TranslateModule.forRoot()],
      providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: TruncatableService, useValue: truncatableServiceStub },
        { provide: BitstreamDataService, useValue: {} },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: AuthorizationDataService, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(JournalVolumeGridElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(JournalVolumeGridElementComponent);
    comp = fixture.componentInstance;
  }));

  describe(`when the journal volume is rendered`, () => {
    beforeEach(() => {
      comp.object = mockItem;
      fixture.detectChanges();
    });

    it(`should contain a JournalVolumeSearchResultGridElementComponent`, () => {
      const journalVolumeGridElement = fixture.debugElement.query(By.css(`ds-journal-volume-search-result-grid-element`));
      expect(journalVolumeGridElement).not.toBeNull();
    });
  });
});
