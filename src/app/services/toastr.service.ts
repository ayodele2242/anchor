import { Injectable } from '@angular/core';
import { ToastrService as Toast } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrService {

  constructor(private toastr: Toast) { }


  showSuccess(message: string, title: string, position: string): void {
    this.toastr.success(message, title, {
      timeOut: 7000,
      positionClass: position,
    });
  }

  showError(message: string, title: string, position: string): void {
    this.toastr.error(message, title, {
      timeOut: 7000,
      positionClass: position,
    });
  }

  showWarning(message: string, title: string, position: string): void {
    this.toastr.warning(message, title, {
      timeOut: 7000,
      positionClass: position,
    });
  }

  showInfo(message: string, title: string, position: string): void {
    this.toastr.info(message, title, {
      timeOut: 7000,
      positionClass: position,
    });
  }


}
