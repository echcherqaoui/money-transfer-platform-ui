import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DepositRequest, Wallet } from '@app/core/models/wallet.model';
import { Observable } from 'rxjs';
import { environment } from '@src/environments/environment';

@Injectable({ providedIn: 'root' })
export class WalletApiService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/wallets`;

  getMe() {
    return this.http.get<Wallet>(`${this.API_URL}/me`);
  }

  deposit(userId: string, req: DepositRequest) {
    return this.http.post<Wallet>(`${this.API_URL}/deposits/${userId}`, req);
  }

  exists(userId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/user/${userId}/exists`);
  }

  create(): Observable<Wallet> {
    return this.http.post<Wallet>(`${this.API_URL}/me`, {});
  }
}
