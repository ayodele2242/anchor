import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedsignalService {

  private commandSource = new Subject<void>();
  command$ = this.commandSource.asObservable();

  constructor() { }

  sendCommand() {
    this.commandSource.next();
  }
}
