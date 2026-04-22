import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ToastService } from '@app/shared/components/toast/toast.service';
import { SseNotification } from '@app/core/models/sse.model';
import { TransferService } from './transfer.service';

@Injectable({ providedIn: 'root' })
export class TransferNotificationHandler {
  private readonly transferService = inject(TransferService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  /**
   * Initializes the global listener for transfer updates.
   */
  init(): void {
    this.transferService.updates$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((notification: SseNotification) =>
        this.processUpdate(notification),
      );
  }

  private processUpdate(notification: SseNotification): void {
    const targetId = notification.data;
    if (!targetId) return;

    const isCurrentPage = this.router.url.includes(targetId);

    isCurrentPage
      ? this.handleActiveViewUpdate(targetId, notification.message)
      : this.handleBackgroundUpdate(targetId, notification.message);
  }

  private handleActiveViewUpdate(id: string, message: string): void {
    // Refresh the data silently;
    this.transferService.loadTransferById(id).subscribe();
    this.toast.info(message);
  }

  private handleBackgroundUpdate(id: string, message: string): void {
    this.toast.info(message, {
      label: `View ${id.substring(0, 8)}`,
      callback: () => this.router.navigate(['/transfers', id]),
    });
  }
}
