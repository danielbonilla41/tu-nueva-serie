import { Routes } from '@angular/router';
import { Accounts } from './pages/accounts/accounts';
import { Cart } from './pages/cart/cart';
import { MeansPayment } from './pages/means-payment/means-payment';
import { Terms } from './pages/terms/terms';
import { AdminCatalog } from './pages/admin-catalog/admin-catalog';
import { AdminProfilesComponent } from './pages/admin-profiles/admin-profiles';
import { CreateAccount } from './pages/create-account/create-account';

export const routes: Routes = [
    // 1. RUTAS DE ADMINISTRACIÓN
    {
        path: 'admin/catalog',
        component: AdminCatalog
    },
    {
        path: 'admin/accounts/:name/reference/:id',
        component: AdminProfilesComponent
    },
    {
        path: 'admin/create-account/:name/reference/:id',
        component: CreateAccount
    },
    // 2. RUTAS PÚBLICAS
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
        path: 'terms-and-conditions',
        component: Terms,
        title: 'Términos y Condiciones'
    },
    {
        path: '',
        redirectTo: 'accounts',
        pathMatch: 'full' // Asegura que solo se redireccione cuando la URL coincide exactamente con ''
    },
    // 3. COMODÍN
    {
        path: '**',
        redirectTo: '',
    }
];