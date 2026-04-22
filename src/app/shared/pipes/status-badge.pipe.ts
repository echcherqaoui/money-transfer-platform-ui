import { Pipe, PipeTransform } from '@angular/core';
import { TransactionStatus } from '@app/core/models/transfer.model';

@Pipe({
  name: 'statusBadge',
  standalone: true,
})
export class StatusBadgePipe implements PipeTransform {
  transform(status: TransactionStatus): string {
    const badges: Record<TransactionStatus, string> = {
      [TransactionStatus.PENDING]: 'badge-warning',
      [TransactionStatus.COMPLETED]: 'badge-success',
      [TransactionStatus.FAILED]: 'badge-danger',
      [TransactionStatus.EXPIRED]: 'badge-gray',
    };
    return badges[status] || 'badge-gray';
  }
}
