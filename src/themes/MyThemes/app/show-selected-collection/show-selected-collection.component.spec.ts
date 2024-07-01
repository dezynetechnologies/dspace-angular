import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSelectedCollectionComponent } from './show-selected-collection.component';

describe('ShowSelectedCollectionComponent', () => {
  let component: ShowSelectedCollectionComponent;
  let fixture: ComponentFixture<ShowSelectedCollectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowSelectedCollectionComponent]
    });
    fixture = TestBed.createComponent(ShowSelectedCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
