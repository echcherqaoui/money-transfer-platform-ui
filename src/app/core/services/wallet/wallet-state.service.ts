import { Injectable, signal, computed } from '@angular/core';
import { Wallet } from '@app/core/models/wallet.model';

@Injectable({ providedIn: 'root' })
export class WalletStateService {
  private state = signal<Wallet | null>(null);
  private loading = signal(false);
  readonly creating = signal(false);

  readonly wallet = this.state.asReadonly();
  readonly isLoading = this.loading.asReadonly();
  readonly isCreating= this.creating.asReadonly();
  readonly balance = computed(() => this.state()?.balance ?? 0);

  setWallet(wallet: Wallet | null) {
    this.state.set(wallet);
  }

  updateBalance(balance: number) {
    this.state.update((curr) => (curr ? { ...curr, balance } : null));
  }

  setLoading(val: boolean) {
    this.loading.set(val);
  }

  setCreating(val: boolean) {
    this.creating.set(val);
  }

  reset(): void {
    this.state.set(null);
    this.loading.set(false);
  }
}
