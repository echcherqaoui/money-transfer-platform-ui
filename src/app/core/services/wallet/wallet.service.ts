import { Injectable, inject } from '@angular/core';
import { tap, finalize, Observable } from 'rxjs';
import { DepositRequest, Wallet } from '@app/core/models/wallet.model';
import { WalletApiService } from './wallet-api.service';
import { WalletStateService } from './wallet-state.service';

@Injectable({ providedIn: 'root' })
export class WalletService {
  private readonly api = inject(WalletApiService);
  private readonly state = inject(WalletStateService);

  readonly wallet = this.state.wallet;
  readonly balance = this.state.balance;
  readonly isLoading = this.state.isLoading;
  readonly isCreating = this.state.isCreating;

  loadWallet() {
    this.state.setLoading(true);
    return this.api.getMe().pipe(
      tap((wallet: Wallet) => this.state.setWallet(wallet)),
      finalize(() => this.state.setLoading(false)),
    );
  }

  createWallet(): Observable<Wallet> {
    this.state.setCreating(true);
    this.state.setLoading(true);

    return this.api.create().pipe(
      tap((wallet: Wallet) => this.state.setWallet(wallet)),
      finalize(() => {
        this.state.setCreating(false);
        this.state.setLoading(false);
      }),
    );
  }

  hasWallet(userId: string): Observable<boolean> {
    return this.api.exists(userId);
  }

  deposit(userId: string, request: DepositRequest): Observable<Wallet> {
    this.state.setLoading(true);

    return this.api.deposit(userId, request).pipe(
      tap(
        (wallet: Wallet) =>
          // Only update if it's the current user's wallet
          this.wallet()?.userId === userId && this.state.setWallet(wallet),
      ),
      finalize(() => this.state.setLoading(false)),
    );
  }

  // Method for the SSE handler to call
  applySseBalanceUpdate(balance: number) {
    this.state.updateBalance(balance);
  }

  reset(): void {
    this.state.reset();
  }
}
