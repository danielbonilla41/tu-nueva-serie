import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeansPayment } from './means-payment';

describe('MeansPayment', () => {
  let component: MeansPayment;
  let fixture: ComponentFixture<MeansPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeansPayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeansPayment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
