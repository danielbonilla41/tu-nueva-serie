import { Routes } from '@angular/router';
import { Accounts } from './pages/accounts/accounts';

export const routes: Routes = [
    // 1. RUTA PRINCIPAL (RAÍZ)
    // Redirige la URL base (http://localhost:4200/) a la ruta '/accounts'.
    {
        path: '',
        redirectTo: 'accounts',
        pathMatch: 'full' // Asegura que solo se redireccione cuando la URL coincide exactamente con ''
    },

    // 2. RUTA DE CUENTAS
    // Carga el componente Accounts cuando la URL es '/accounts'.
    {
        path: 'accounts',
        component: Accounts,
        title: 'Cuentas Streaming'
    },

    // 3. RUTA COMODÍN (Manejo de 404)
    // Redirige cualquier URL desconocida de vuelta a la raíz.
    {
        path: '**',
        redirectTo: '',
    }
];