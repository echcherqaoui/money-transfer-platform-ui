import {
  Component,
  inject,
  computed
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TransferService } from '@app/core/services/transfer/transfer.service';
import { AuthService } from '@app/core/services/auth.service';
import { TransactionStatus } from '@app/core/models/transfer.model';
import { LoadingSpinnerComponent } from '@app/shared/components/loading-spinner/loading-spinner.component';

const STATUS_COLORS: Record<TransactionStatus, string> = {
  [TransactionStatus.COMPLETED]: 'bg-success-50 text-success-700 border-success-200',
  [TransactionStatus.PENDING]:
    'bg-warning-50 text-warning-700 border-warning-200',
  [TransactionStatus.FAILED]: 
  'bg-danger-50 text-danger-700 border-danger-200',
  [TransactionStatus.EXPIRED]: 
  'bg-danger-50 text-danger-700 border-danger-200',
};

const STATUS_ICONS: Record<TransactionStatus, string> = {
  [TransactionStatus.COMPLETED]:
    'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  [TransactionStatus.PENDING]: 
  'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  [TransactionStatus.FAILED]:
    'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  [TransactionStatus.EXPIRED]:
    'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
};

const DEFAULT_STATUS_COLOR = 'bg-gray-50 text-gray-700 border-gray-200';
const DEFAULT_STATUS_ICON =
  'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';

@Component({
  selector: 'app-transfer-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './transfer-detail.component.html',
})
export class TransferDetailComponent {
  private readonly transferService = inject(TransferService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  protected readonly transfer = this.transferService.transferDetail;
  protected readonly loading = this.transferService.isLoading;
  protected readonly error = this.transferService.error;

  readonly TransactionStatus = TransactionStatus;

  protected readonly isSender = computed(
    () => this.transfer()?.senderId === this.authService.user()?.id,
  );

  protected readonly statusColor = computed(() => {
    const status = this.transfer()?.status;
    return status
      ? (STATUS_COLORS[status] ?? DEFAULT_STATUS_COLOR)
      : DEFAULT_STATUS_COLOR;
  });

  protected readonly statusIcon = computed(() => {
    const status = this.transfer()?.status;
    return status
      ? (STATUS_ICONS[status] ?? DEFAULT_STATUS_ICON)
      : DEFAULT_STATUS_ICON;
  });

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed())
    .subscribe((params) => {
      const id = params.get('id');
      id && this.loadTransfer(id);
    });
  }

  private loadTransfer(id: string): void {
    this.transferService.loadTransferById(id).subscribe();
  }
}
