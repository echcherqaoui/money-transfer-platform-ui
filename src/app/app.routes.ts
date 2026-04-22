import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/auth.guard';
import { transferRoutes } from './features/transfers/transfers.routes';

export const routes: Routes = [
  {
    path: '',
    canActivate: [roleGuard()], 
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'transfers',
        children: transferRoutes,
      },
      {
        path: 'wallet',
        loadComponent: () => import('./features/wallet/wallet.component').then(m => m.WalletOverviewComponent),
      },
      {
        path: 'admin',
        canActivate: [roleGuard('ADMIN')],
        loadComponent: () => import('./features/admin/diposit/deposit.component').then(m => m.DepositComponent),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];