import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProfiles } from './admin-profiles';

describe('AdminProfiles', () => {
  let component: AdminProfiles;
  let fixture: ComponentFixture<AdminProfiles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProfiles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProfiles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
