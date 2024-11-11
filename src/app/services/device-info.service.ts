import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceInfoService {

  constructor() { }

  getDeviceType(): string {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      ? 'Mobile'
      : 'Desktop';
  }

  getBrowser(): string {
    const userAgent = navigator.userAgent;
    const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'IE', 'Opera'];
    for (const browser of browsers) {
      if (userAgent.includes(browser)) {
        return browser;
      }
    }
    return 'Unknown';
  }

  getOS(): string {
    const userAgent = navigator.userAgent;
    const osList = ['Windows', 'Mac', 'Linux', 'iOS', 'Android'];
    for (const os of osList) {
      if (userAgent.includes(os)) {
        return os;
      }
    }
    return 'Unknown';
  }
  
}
