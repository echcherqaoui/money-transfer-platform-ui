import { Injectable, inject, DestroyRef } from '@angular/core';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';
import {
  PaginatedTransfers,
  TransactionStatus,
  TransferDetail,
  TransferRequest,
  TransferResponse,
  TransferStats,
} from '@app/core/models/transfer.model';
import { SseService } from '@app/core/services/sse.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TransferUpdateEventService } from './transfer-update-event.service';
import { TransferStateService } from './transfer-state.service';
import { TransferApiService } from './transfer-api.service';

@Injectable({
  providedIn: 'root',
})
export class TransferService {
  private readonly api = inject(TransferApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly state = inject(TransferStateService);
  private readonly sse = inject(SseService);

  private readonly updateEvents = inject(TransferUpdateEventService);

  // Expose state signals
  readonly transfers = this.state.transfers;
  readonly stats = this.state.stats;
  readonly transferDetail = this.state.transferDetail;
  readonly isLoading = this.state.isLoading;
  readonly error = this.state.error;
  readonly totalSent = this.state.totalSent;
  readonly totalReceived = this.state.totalReceived;
  readonly totalCount = this.state.totalCount;

  // Expose update events for components
  readonly updates$ = this.updateEvents.updates$;

  initialize(): void {
    this.sse
      .connectToTransferUpdates()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (notification) => this.updateEvents.emitUpdate(notification), //the "pump" that pushes data to the handler
      );
  }

  initiateTransfer(request: TransferRequest): Observable<TransferResponse> {
    this.state.setLoading(true);
    this.state.setError(null);

    return this.api
      .initiateTransfer(request)
      .pipe(finalize(() => this.state.setLoading(false)));
  }

  loadTransfers(
    page: number = 0,
    size: number = 10,
    status?: TransactionStatus | null,
  ): Observable<PaginatedTransfers> {
    if (page < 0 || size <= 0)
      return throwError(() => new Error('Invalid pagination parameters'));

    const isFirst = page == 0;

    isFirst && this.state.setLoading(true);
    this.state.setError(null);

    return this.api.getTransfers(page, size, status).pipe(
      tap((result: PaginatedTransfers) =>
        this.state.setTransfers(result.content, page > 0),
      ),
      finalize(() => isFirst && this.state.setLoading(false)),
    );
  }

  loadTransferById(id: string): Observable<TransferDetail> {
    this.state.setLoading(true);
    this.state.setError(null);

    return this.api.getTransferById(id).pipe(
      tap((transfer: TransferDetail) => this.state.setTransferDetail(transfer)),
      catchError((err) =>
        this.handleError('Failed to load transfer details', err),
      ),
      finalize(() => this.state.setLoading(false)),
    );
  }

  loadStats(): Observable<TransferStats> {
    return this.api.getStats().pipe(tap((stats) => this.state.setStats(stats)));
  }

  reset(): void {
    this.state.reset();
  }

  private handleError(message: string, error: any): Observable<never> {
    this.state.setError(message);
    return throwError(() => error);
  }
}
