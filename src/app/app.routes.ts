import { Routes } from '@angular/router';
import { Accounts } from './pages/accounts/accounts';
export const routes: Routes = [
    {
        path: '',
        component: Accounts,
        title: 'Cuentas Streaming'
    },
    {
        path: 'accounts',
        redirectTo: '', // Redirige /accounts a la raíz (/)
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '',
    }
];
