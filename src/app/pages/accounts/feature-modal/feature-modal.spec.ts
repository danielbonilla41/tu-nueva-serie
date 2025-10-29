import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureModal } from './feature-modal';

describe('FeatureModal', () => {
  let component: FeatureModal;
  let fixture: ComponentFixture<FeatureModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeatureModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
