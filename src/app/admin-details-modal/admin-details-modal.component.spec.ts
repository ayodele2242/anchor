import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDetailsModalComponent } from './admin-details-modal.component';

describe('AdminDetailsModalComponent', () => {
  let component: AdminDetailsModalComponent;
  let fixture: ComponentFixture<AdminDetailsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDetailsModalComponent]
    });
    fixture = TestBed.createComponent(AdminDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
