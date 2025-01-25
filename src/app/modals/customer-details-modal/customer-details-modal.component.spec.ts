import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailsModalComponent } from './customer-details-modal.component';

describe('CustomerDetailsModalComponent', () => {
  let component: CustomerDetailsModalComponent;
  let fixture: ComponentFixture<CustomerDetailsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerDetailsModalComponent]
    });
    fixture = TestBed.createComponent(CustomerDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
