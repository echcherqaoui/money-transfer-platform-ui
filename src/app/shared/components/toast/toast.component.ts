import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'toast.component.html'
})
export class ToastComponent implements OnInit {
  private readonly toastService = inject(ToastService);
  toasts: Toast[] = [];

  ngOnInit(): void {
    this.toastService.toast$.subscribe(toast => {
      this.toasts.push(toast);

      (toast.duration) && setTimeout(() => this.remove(toast.id), toast.duration);
    });
  }

  handleAction(toast: Toast): void {
    if (toast.action) {
      toast.action.callback(); // Run the logic provided by the caller
      this.remove(toast.id);   // Clean up the toast
    }
  }

  remove(id: string): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}