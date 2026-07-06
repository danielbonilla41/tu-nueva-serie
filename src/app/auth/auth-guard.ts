import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';
import { authState } from '@angular/fire/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  // Escucha el estado de autenticación actual de Firebase
  return authState(auth).pipe(
    take(1),
    map(user => {
      if (user) {
        return true; // Hay sesión activa, permite el acceso
      } else {
        // No está logueado, lo manda al login
        router.navigate(['/admin/login']);
        return false;
      }
    })
  );
};