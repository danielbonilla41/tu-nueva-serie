import { Routes } from '@angular/router';
import { Accounts } from './pages/accounts/accounts';
import { Cart } from './pages/cart/cart';
import { MeansPayment } from './pages/means-payment/means-payment';
export const routes: Routes = [
    {
        path: '',
        redirectTo: 'accounts',
        pathMatch: 'full' // Asegura que solo se redireccione cuando la URL coincide exactamente con ''
    },
    {
        path: 'accounts',
        component: Accounts,
        title: 'Cuentas Streaming'
    },
    {
        path: 'cart',
        component: Cart,
        title: 'Tu Carrito'
    },
    {
        path: 'payment',
        component: MeansPayment,
        title: 'Medios de pago'
    },
    {
        path: '**',
        redirectTo: 'accounts',
    }
];