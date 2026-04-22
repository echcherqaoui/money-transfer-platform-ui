import { Injectable, signal, computed } from '@angular/core';
import {
  Transfer,
  TransferDetail,
  TransferStats,
} from '@app/core/models/transfer.model';

@Injectable({
  providedIn: 'root',
})
export class TransferStateService {
  // Private state
  private readonly transfersState = signal<Transfer[]>([]);
  private readonly statsState = signal<TransferStats | null>(null);
  private readonly transferDetailState = signal<TransferDetail | null>(null);
  private readonly loadingState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);

  // Public readonly signals
  readonly transfers = this.transfersState.asReadonly();
  readonly stats = this.statsState.asReadonly();
  readonly transferDetail = this.transferDetailState.asReadonly();
  readonly isLoading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly totalSent = computed(() => this.stats()?.totalSent ?? 0);
  readonly totalReceived = computed(() => this.stats()?.totalReceived ?? 0);
  readonly totalCount = computed(() => this.stats()?.totalCount ?? 0);

  setTransfers(transfers: Transfer[], append: boolean = false): void {
    append
      ? this.transfersState.update((current) => [...current, ...transfers])
      : this.transfersState.set(transfers);
  }

  setStats(stats: TransferStats): void {
    this.statsState.set(stats);
  }

  setTransferDetail(transfer: TransferDetail): void {
    this.transferDetailState.set(transfer);
  }

  setLoading(loading: boolean): void {
    this.loadingState.set(loading);
  }

  setError(error: string | null): void {
    this.errorState.set(error);
  }

  reset(): void {
    this.transfersState.set([]);
    this.statsState.set(null);
    this.transferDetailState.set(null);
    this.loadingState.set(false);
    this.errorState.set(null);
  }
}
