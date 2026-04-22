import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WalletService } from '@app/core/services/wallet/wallet.service';
import { TransferService } from '@app/core/services/transfer/transfer.service';
import { AuthService } from '@app/core/services/auth.service';
import { BalanceCardComponent } from '@app/shared/components/balance-card/balance-card.component';
import { TransactionCardComponent } from '@app/shared/components/transaction-card/transaction-card.component';
import { LoadingSpinnerComponent } from '@app/shared/components/loading-spinner/loading-spinner.component';
import { ToastService } from '@app/shared/components/toast/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    BalanceCardComponent,
    TransactionCardComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: 'dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private readonly walletService = inject(WalletService);
  private readonly transferService = inject(TransferService);
  protected readonly authService = inject(AuthService);
  protected readonly toastService = inject(ToastService);

  protected readonly wallet = this.walletService.wallet;
  protected readonly recentTransfers = this.transferService.transfers;
  protected readonly totalSent = this.transferService.totalSent;
  protected readonly totalReceived = this.transferService.totalReceived;
  protected readonly totalCount = this.transferService.totalCount;

  protected readonly loading = computed(
    () => this.walletService.isLoading() || this.transferService.isLoading(),
  );

  private readonly pageSize = 10;

  ngOnInit(): void {
    this.authService.user() && this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.walletService.loadWallet().subscribe();

    this.transferService.loadTransfers(0, this.pageSize).subscribe();

    this.transferService.loadStats().subscribe();
  }
}
