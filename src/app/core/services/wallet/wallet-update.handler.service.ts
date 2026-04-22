import { DestroyRef, inject, Injectable } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { SseService } from "@app/core/services/sse.service";
import { WalletService } from "./wallet.service";

@Injectable({ providedIn: 'root' })
export class WalletUpdateHandler {
  private readonly sse = inject(SseService);
  private readonly walletService = inject(WalletService);
  private readonly destroyRef = inject(DestroyRef);

  init(): void {
    this.sse.connectToBalanceUpdates()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (update) => this.walletService.applySseBalanceUpdate(update.balance),
        error: (err) => console.error('Wallet SSE error:', err)
      });
  }
}