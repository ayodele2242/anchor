import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBrokerModalComponent } from './update-broker-modal.component';

describe('UpdateBrokerModalComponent', () => {
  let component: UpdateBrokerModalComponent;
  let fixture: ComponentFixture<UpdateBrokerModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateBrokerModalComponent]
    });
    fixture = TestBed.createComponent(UpdateBrokerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
