import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InternetService {
  private onlineStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public onlineStatus$ = this.onlineStatusSubject.asObservable();

  constructor() {
    this.initializeOnlineStatus();
    this.registerOnlineStatusEvents();
  }

  private initializeOnlineStatus(): void {
    this.onlineStatusSubject.next(window.navigator.onLine);
  }

  private registerOnlineStatusEvents(): void {
    window.addEventListener('online', () => {
      this.onlineStatusSubject.next(true);
    });

    window.addEventListener('offline', () => {
      this.onlineStatusSubject.next(false);
    });
  }
}
