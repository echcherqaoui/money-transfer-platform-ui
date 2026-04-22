export interface Wallet {
  userId: string;
  balance: number;
}

export interface BalanceUpdate {
  userId: string;
  balance: number;
}

export interface DepositRequest {
  amount: number;
}