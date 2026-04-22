import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { TransferNotificationHandler } from './core/services/transfer/transfer-notification-handler.service';
import { TransferService } from './core/services/transfer/transfer.service';
import { WalletUpdateHandler } from './core/services/wallet/wallet-update.handler.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, ToastComponent],
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  private readonly transferService = inject(TransferService);
  private readonly notificationHandler = inject(TransferNotificationHandler);
  private readonly walletUpdateHandler = inject(WalletUpdateHandler);

  ngOnInit(): void {
    this.transferService.initialize();
    this.notificationHandler.init();
    this.walletUpdateHandler.init();
  }
}
