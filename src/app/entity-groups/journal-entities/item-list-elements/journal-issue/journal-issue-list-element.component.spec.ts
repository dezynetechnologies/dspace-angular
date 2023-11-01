import { waitForAsync, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { JournalIssueListElementComponent } from './journal-issue-list-element.component';
import { of as observableOf } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { DSONameServiceMock } from '../../../../shared/mocks/dso-name.service.mock';
import { APP_CONFIG } from '../../../../../config/app-config.interface';
import { environment } from '../../../../../environments/environment.test';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../../../shared/theme-support/theme.service';
import { getMockThemeService } from '../../../../shared/mocks/theme-service.mock';
import { mockTruncatableService } from '../../../../shared/mocks/mock-trucatable.service';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../../../shared/testing/active-router.stub';
import { AuthService } from '../../../../core/auth/auth.service';
import { AuthServiceMock } from '../../../../shared/mocks/auth.service.mock';
import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';

const mockItem: Item = Object.assign(new Item(), {
  bundles: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'publicationvolume.volumeNumber': [
      {
        language: 'en_US',
        value: '1234'
      }
    ],
    'publicationissue.issueNumber': [
      {
        language: 'en_US',
        value: '5678'
      }
    ]
  }
});

describe('JournalIssueListElementComponent', () => {
  let comp;
  let fixture;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [JournalIssueListElementComponent, TruncatePipe, TranslateModule.forRoot()],
      providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: TruncatableService, useValue: mockTruncatableService },
        { provide: APP_CONFIG, useValue: environment },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: AuthorizationDataService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(JournalIssueListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(JournalIssueListElementComponent);
    comp = fixture.componentInstance;
  }));

  describe(`when the journal issue is rendered`, () => {
    beforeEach(() => {
      comp.object = mockItem;
      fixture.detectChanges();
    });

    it(`should contain a JournalIssueListElementComponent`, () => {
      const journalIssueListElement = fixture.debugElement.query(By.css(`ds-journal-issue-search-result-list-element`));
      expect(journalIssueListElement).not.toBeNull();
    });
  });

});
