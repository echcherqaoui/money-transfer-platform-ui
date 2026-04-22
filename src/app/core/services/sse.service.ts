import { Injectable, NgZone, inject } from '@angular/core';
import { Observable, share } from 'rxjs';
import { BalanceUpdate } from '@app/core/models/wallet.model';
import { SseNotification } from '@app/core/models/sse.model';

@Injectable({ providedIn: 'root' })
export class SseService {
  private readonly zone = inject(NgZone);
  private readonly connections = new Map<string, EventSource>();

  connectToBalanceUpdates(): Observable<BalanceUpdate> {
    return this.createSseObservable<BalanceUpdate>('/api/v1/wallets/stream', {
      'balance-update': (data) => JSON.parse(data),
    });
  }

  connectToTransferUpdates(): Observable<SseNotification> {
    return this.createSseObservable<SseNotification>(
      '/api/v1/transfers/stream',
      {
        'transfer-sent-update': (data) => ({
          message: 'Your transfer status has been updated.',
          type: 'SENT_UPDATE',
          data,
        }),
        'transfer-received': (data) => ({
          message: 'You have received a new transfer!',
          type: 'RECEIVED',
          data,
        }),
      },
    );
  }

  disconnectAll(): void {
    this.connections.forEach((source, url) => {
      source.close();
      this.connections.delete(url);
    });
  }

  private createSseObservable<T>(
    url: string,
    eventMap: Record<string, (data: string) => T>,
  ): Observable<T> {
    return new Observable<T>((observer) => {
      let connection = this.connections.get(url);

      if (!connection) {
        connection = new EventSource(url);
        this.connections.set(url, connection);
      }

      // Register all mapped events
      const listeners = Object.entries(eventMap).map(
        ([eventName, transformer]) => {
          const handler = (event: MessageEvent) => {
            this.zone.run(() => {
              try {
                observer.next(transformer(event.data));
              } catch (err) {
                console.error(`SSE Parse Error [${eventName}]:`, err);
              }
            });
          };
          connection!.addEventListener(eventName, handler);
          return { eventName, handler };
        },
      );

      connection.onerror = (error) => {
        this.zone.run(() => {
          // Only error out if the connection is truly dead (Closed)
          connection?.readyState === EventSource.CLOSED &&
            observer.error(error);
        });
      };

      return () => {
        // Teardown: Remove specific listeners
        listeners.forEach(({ eventName, handler }) => {
          connection?.removeEventListener(eventName, handler);
        });

        // No need to close the EventSource,other components might be sharing it via share()
      };
    }).pipe(share());
  }
}
