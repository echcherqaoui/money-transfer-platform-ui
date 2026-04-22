import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  action?: {
    label: string;
    callback: () => void;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new Subject<Toast>();
  public toast$ = this.toastSubject.asObservable();

  show(type: Toast['type'], message: string, action?: Toast['action'], duration: number = 5000): void {
    const toast: Toast = {
      id: Math.random().toString(36).substring(7),
      type,
      message,
      duration,
      action
    };
    this.toastSubject.next(toast);
  }

  success(message: string, action?: Toast['action']): void {
    this.show('success', message, action);
  }

  error(message: string, action?: Toast['action']): void {
    this.show('error', message, action);
  }

  warning(message: string, action?: Toast['action']): void {
    this.show('warning', message, action);
  }

  info(message: string, action?: Toast['action']): void {
    this.show('info', message, action);
  }
}
