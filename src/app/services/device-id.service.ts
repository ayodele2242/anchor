import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class DeviceIdService {
  private deviceId: any;

  constructor() {
    this.deviceId = localStorage.getItem('deviceId');
    if (!this.deviceId) {
      this.deviceId = uuidv4();
      localStorage.setItem('deviceId', this.deviceId);
    }
  }

  getDeviceId(): string {
    return this.deviceId;
  }
}
