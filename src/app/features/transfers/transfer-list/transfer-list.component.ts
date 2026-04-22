import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TransferService } from '@app/core/services/transfer/transfer.service';
import { AuthService } from '@app/core/services/auth.service';
import { TransactionCardComponent } from '@app/shared/components/transaction-card/transaction-card.component';
import { LoadingSpinnerComponent } from '@app/shared/components/loading-spinner/loading-spinner.component';
import { TransactionStatus } from '@app/core/models/transfer.model';
import { PAGINATION_CONFIG } from '@app/core/config/pagination.config';

@Component({
  selector: 'app-transfer-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TransactionCardComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: 'transfer-list.component.html',
})
export class TransferListComponent implements OnInit {
  private readonly transferService = inject(TransferService);
  protected readonly authService = inject(AuthService);

  readonly allTransfers = this.transferService.transfers;
  readonly isLoading = this.transferService.isLoading;

  readonly filterStatus = signal<TransactionStatus | null>(null);
  readonly currentPage = signal<number>(0);
  readonly hasMore = signal<boolean>(true);
  readonly isLoadingMore = signal<boolean>(false);

  readonly statuses = Object.values(TransactionStatus) as TransactionStatus[];

  readonly canLoadMore = computed(
    () => this.hasMore() && !this.isLoadingMore() && !this.isLoading(),
  );

  ngOnInit(): void {
    this.fetch(0);
  }

  loadMore(): void {
    if (!this.canLoadMore()) return;
    this.fetch(this.currentPage() + 1);
  }

  setFilter(status: TransactionStatus | null): void {
    if (this.filterStatus() === status) return;

    this.filterStatus.set(status);
    this.currentPage.set(0);
    this.hasMore.set(true);
    this.fetch(0);
  }

  private fetch(page: number): void {
    const isAppending = page > 0;

    isAppending && this.isLoadingMore.set(true);

    this.transferService
      .loadTransfers(
        page,
        PAGINATION_CONFIG.defaultPageSize,
        this.filterStatus(),
      )
      .subscribe({
        next: (result) => {
          this.hasMore.set(result.hasMore);
          this.currentPage.set(page);

          if (isAppending) {
            this.isLoadingMore.set(false);
            this.scrollToNewItems();
          }
        },
        error: (err) => {
          console.error('Failed to load transfers', err);
          this.isLoadingMore.set(false);
        },
      });
  }

  private scrollToNewItems(): void {
    requestAnimationFrame(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    });
  }
}
