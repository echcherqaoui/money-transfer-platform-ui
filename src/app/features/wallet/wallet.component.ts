import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WalletService } from '@app/core/services/wallet/wallet.service';
import { BalanceCardComponent } from '@app/shared/components/balance-card/balance-card.component';
import { LoadingSpinnerComponent } from '@app/shared/components/loading-spinner/loading-spinner.component';
import { ToastService } from '@app/shared/components/toast/toast.service';

@Component({
  selector: 'app-wallet-overview',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    BalanceCardComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: 'wallet.component.html',
})
export class WalletOverviewComponent implements OnInit {
  private readonly walletService = inject(WalletService);
  private readonly toastService = inject(ToastService);

  readonly wallet = this.walletService.wallet;
  readonly hasWallet = computed(() => !!this.wallet());

  readonly isLoading = this.walletService.isLoading;
  readonly isCreating = this.walletService.isCreating;

  ngOnInit(): void {
    this.walletService.loadWallet().subscribe();
  }

  createWallet(): void {
    this.walletService.createWallet().subscribe({
      next: () => {
        this.toastService.success('Wallet created!');
      },
      error: (error) => {
        this.toastService.error(
          error.error?.message || 'Failed to create wallet',
        );
      },
    });
  }
}
