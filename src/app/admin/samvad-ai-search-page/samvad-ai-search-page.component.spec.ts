import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SamvadAISearchPageComponent } from './samvad-ai-search-page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SamvadAISearchPageComponent', () => {
  let component: SamvadAISearchPageComponent;
  let fixture: ComponentFixture<SamvadAISearchPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SamvadAISearchPageComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamvadAISearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
