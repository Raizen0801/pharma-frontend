import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly PERMISOS_KEY = 'permisos';

  tienePermiso(permiso: string): boolean {
    const raw = localStorage.getItem(this.PERMISOS_KEY);
    if (!raw) {
      return true;
    }
    try {
      const permisos = JSON.parse(raw) as string[];
      return permisos.includes(permiso);
    } catch {
      return false;
    }
  }

  establecerPermisos(permisos: string[]): void {
    localStorage.setItem(this.PERMISOS_KEY, JSON.stringify(permisos));
  }
}
