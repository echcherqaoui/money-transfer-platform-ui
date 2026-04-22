import { Injectable, inject, signal, computed, Injector } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, EMPTY } from 'rxjs';
import { User } from '@app/core/models/user.model';
import { SseService } from './sse.service';
import { WalletService } from './wallet/wallet.service';
import { TransferService } from './transfer/transfer.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly injector = inject(Injector);
  private readonly document = inject(DOCUMENT);
  private readonly http = inject(HttpClient);
  private readonly sse = inject(SseService);

  private userState = signal<User | null>(null);

  // Expose data clearly
  readonly user = this.userState.asReadonly();
  readonly isAuthenticated = computed(() => !!this.userState());

  // This ensures the app doesn't start until we know the auth status.
  loadUser(): Observable<User | null> {
    return this.http.get<User>('/auth/me').pipe(
      tap((user) => this.userState.set(user)),
      catchError(() => {
        this.userState.set(null);
        return EMPTY;
      }),
    );
  }

  login(): void {
    // In a BFF. We redirect to the Gateway's OIDC starter.
    window.location.href = '/oauth2/authorization/keycloak';
  }

  /**
   * Logout and cleanup all state
   */
  logout(): void {
    // Disconnect all SSE connections
    this.sse.disconnectAll();

    // Clear application state
    this.resetDependentServices();
    this.userState.set(null);

    // Clear browser storage
    localStorage.clear();
    sessionStorage.clear();

    // Perform server-side logout
    this.submitLogoutForm();
  }

  hasRole(role: string): boolean {
    return this.user()?.roles?.includes(role) ?? false;
  }

  private resetDependentServices(): void {
    // Break circular dependencies by fetching services only when needed
    this.injector.get(WalletService, null)?.reset();
    this.injector.get(TransferService, null)?.reset();
  }

  private getCookie(name: string): string | undefined {
    return this.document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${name}=`))
      ?.split('=')[1];
  }

  private submitLogoutForm(): void {
    const form = this.document.createElement('form');
    form.method = 'POST';
    form.action = '/logout';

    const csrfToken = this.getCookie('XSRF-TOKEN');
    if (csrfToken) {
      const input = this.document.createElement('input');
      input.type = 'hidden';
      input.name = '_csrf';
      input.value = decodeURIComponent(csrfToken);
      form.appendChild(input);
    }

    this.document.body.appendChild(form);
    form.submit();
  }
}
