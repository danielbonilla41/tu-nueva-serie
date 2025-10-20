import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccounDetails } from './accoun-details';

describe('AccounDetails', () => {
  let component: AccounDetails;
  let fixture: ComponentFixture<AccounDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccounDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccounDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
