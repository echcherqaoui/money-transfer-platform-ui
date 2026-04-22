import { Component, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyFormatPipe } from '@app/shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-balance-card',
  standalone: true,
  imports: [CommonModule, CurrencyFormatPipe],
  templateUrl: 'balance-card.component.html',
})
export class BalanceCardComponent {
  balance = input<number>(0);
  showRealTimeIndicator = input<boolean>(false);
}
