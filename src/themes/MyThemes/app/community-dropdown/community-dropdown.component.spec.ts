import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityDropdownComponent } from './community-dropdown.component';

describe('CommunityDropdownComponent', () => {
  let component: CommunityDropdownComponent;
  let fixture: ComponentFixture<CommunityDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommunityDropdownComponent]
    });
    fixture = TestBed.createComponent(CommunityDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
