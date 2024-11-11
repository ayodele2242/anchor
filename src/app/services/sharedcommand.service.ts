import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SharedCommandService {
  private commandSubject = new Subject<string>();

  sendCommand(command: string) {
    this.commandSubject.next(command);
  }

  getCommand() {
    return this.commandSubject.asObservable();
  }
}
