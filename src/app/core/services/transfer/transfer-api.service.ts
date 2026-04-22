import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PaginatedTransfers,
  TransactionStatus,
  TransferDetail,
  TransferRequest,
  TransferResponse,
  TransferStats,
} from '@app/core/models/transfer.model';
import { environment } from '@src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransferApiService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/transfers`;

  initiateTransfer(request: TransferRequest): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(this.API_URL, request);
  }

  getTransfers(
    page: number,
    size: number,
    status?: TransactionStatus | null,
  ): Observable<PaginatedTransfers> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (status) params = params.set('status', status);
    
    return this.http.get<PaginatedTransfers>(`${this.API_URL}/me`, { params });
  }

  getTransferById(id: string): Observable<TransferDetail> {
    return this.http.get<TransferDetail>(`${this.API_URL}/me/${id}`);
  }

  getStats(): Observable<TransferStats> {
    return this.http.get<TransferStats>(`${this.API_URL}/stats`);
  }
}