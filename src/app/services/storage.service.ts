import { Injectable } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  static getStorage(arg0: { key: string; }): any {
    throw new Error('Method not implemented.');
  }
  constructor() { }

  setStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getStorage(key: string): any {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : of(null);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
