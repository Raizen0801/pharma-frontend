import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permisoGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const permisoRequerido = route.data?.['permiso'] as string | undefined;

  if (!permisoRequerido || authService.tienePermiso(permisoRequerido)) {
    return true;
  }

  return router.parseUrl('/acceso-denegado');
};
