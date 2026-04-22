import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TransferService } from '@app/core/services/transfer/transfer.service';
import { ToastService } from '@app/shared/components/toast/toast.service';
import { UUID_PATTERN } from '@app/core/constants/validation.constants';
import { WalletService } from '@src/app/core/services/wallet/wallet.service';
import { EMPTY, switchMap } from 'rxjs';

@Component({
  selector: 'app-new-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: 'new-transfer.component.html',
})
export class NewTransferComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  private readonly transferService = inject(TransferService);
  private readonly walletService = inject(WalletService);
  private readonly toastService = inject(ToastService);

  readonly isLoading = this.transferService.isLoading;
  protected walletNotFound = signal(false);

  readonly transferForm = this.fb.group({
    receiverId: ['', [Validators.required, Validators.pattern(UUID_PATTERN)]],
    amount: [null as number | null, [Validators.required, Validators.min(1)]],
  });

  isFieldInvalid(field: string): boolean {
    const control = this.transferForm.get(field);
    return !!(control?.invalid && (control.dirty || control.touched));
  }

  onInputChange(): void {
    this.walletNotFound.set(false);
  }


  onSubmit(): void {
    if (!this.transferForm.valid) return;

    const { receiverId, amount } = this.transferForm.value;

    this.walletService
      .hasWallet(receiverId!)
      .pipe(
        // Transform the stream: check existence first
        switchMap((exists) => {
          if (!exists) {
            this.walletNotFound.set(true);
            this.toastService.error('Recipient wallet does not exist.');
            return EMPTY;
          }
          // Proceed to deposit
          return this.transferService.initiateTransfer({
            receiverId: receiverId!,
            amount: amount!,
          });
        }),
      ).subscribe({
        next: (response) => {
          this.toastService.success('Transfer initiated successfully!');
          this.router.navigate(['/transfers', response.id]);
        },
        error: (error) => {
          this.toastService.error(
            error.error?.message || 'Transfer failed. Please try again.',
          );
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
