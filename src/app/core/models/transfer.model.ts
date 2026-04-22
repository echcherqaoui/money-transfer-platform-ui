export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
}

export interface Transfer {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  status: TransactionStatus;
  createdAt?: Date;
}

export interface TransferDetail {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  status: TransactionStatus;
  createdAt?: Date;
  reason: string
}

export interface PaginatedTransfers {
  content: Transfer[];
  totalCount: number;
  page: number;
  size: number;
  hasMore: boolean;
  totalPages: number;
}

export interface TransferStats {
  totalSent: number;
  totalReceived: number;
  totalCount: number;
}

export interface TransferRequest {
  receiverId: string;
  amount: number;
}

export interface TransferResponse {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  status: TransactionStatus;
}