import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WalletService } from '@app/core/services/wallet/wallet.service';
import { ToastService } from '@app/shared/components/toast/toast.service';
import { switchMap, EMPTY } from 'rxjs';
import { UUID_PATTERN } from '@app/core/constants/validation.constants';

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './deposit.component.html',
})
export class DepositComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  private readonly walletService = inject(WalletService);
  private readonly toastService = inject(ToastService);

  protected walletNotFound = signal(false);
  protected isLoading = this.walletService.isLoading;

  depositForm = this.fb.group({
    targetUserId: ['', [Validators.required, Validators.pattern(UUID_PATTERN)]],
    amount: [null, [Validators.required, Validators.min(1)]],
  });

  isFieldInvalid(field: string): boolean {
    const control = this.depositForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onInputChange(): void {
    this.walletNotFound.set(false);
  }

  onSubmit(): void {
    if (this.depositForm.valid) {
      const { targetUserId, amount } = this.depositForm.getRawValue();

      // Verify existence before processing
      this.walletService
        .hasWallet(targetUserId!)
        .pipe(
          // Transform the stream: check existence first
          switchMap((exists) => {
            if (!exists) {
              this.walletNotFound.set(true);
              this.toastService.error('Recipient wallet does not exist.');
              // Return EMPTY to kill the chain here
              return EMPTY;
            }
            // Proceed to deposit
            return this.walletService.deposit(targetUserId!, {
              amount: amount!,
            });
          }),
        )
        .subscribe({
          next: () => {
            this.toastService.success('Deposit successfully credited.');
            this.router.navigate(['/admin/dashboard']);
          },
          error: (error) => {
            this.toastService.error(error.error?.message || 'Deposit failed.');
          },
        });
    }
  }

  cancel(): void {
    this.router.navigate(['/transfers']);
  }
}
