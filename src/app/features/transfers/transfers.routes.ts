import { Routes } from '@angular/router';

export const transferRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./transfer-list/transfer-list.component').then(
        (m) => m.TransferListComponent,
      ),
    title: 'Transfers',
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./new-transfer/new-transfer.component').then(
        (m) => m.NewTransferComponent,
      ),
    title: 'New Transfer',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./transfer-detail/transfer-detail.component').then(
        (m) => m.TransferDetailComponent,
      ),
    title: 'Transfer Details',
  },
];
