import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TransactionStatus, Transfer } from '@app/core/models/transfer.model';
import { StatusBadgePipe } from '@app/shared/pipes/status-badge.pipe';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';

@Component({
  selector: 'app-transaction-card',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgePipe, CurrencyFormatPipe],
  templateUrl: 'transaction-card.component.html'
})
export class TransactionCardComponent {
  filterStatus = input<TransactionStatus | null>(null);
  transfer = input.required<Transfer>();
  currentUserId = input.required<string>();

  // Derived state using computed
  isSent = computed(() => this.transfer().senderId === this.currentUserId());
}