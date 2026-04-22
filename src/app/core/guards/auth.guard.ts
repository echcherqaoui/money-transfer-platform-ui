import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { environment } from '@src/environments/environment';

// auth.guard.ts
export const roleGuard = (requiredRole?: string): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const user = authService.user();

    if (!user) {
      // Redirection FORCE vers la Gateway pour initier le flux OAuth2
      window.location.href = `${environment.gatewayUrl}/oauth2/authorization/keycloak`;
      return false;
    }

    if (requiredRole && !user.roles.includes(requiredRole)) {
      inject(Router).navigate(['/unauthorized']);
      return false;
    }

    return true;
  };
};