import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { SseNotification } from '@app/core/models/sse.model';


@Injectable({
  providedIn: 'root',
})
export class TransferUpdateEventService {
  private readonly updateSubject = new Subject<SseNotification>();

  readonly updates$: Observable<SseNotification> = this.updateSubject.asObservable();

  emitUpdate(notification: SseNotification): void {
    this.updateSubject.next(notification);
  }
}
