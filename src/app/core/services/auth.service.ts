import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly PERMISOS_KEY = 'permisos';
  private readonly USUARIO_KEY = 'usuario';

  readonly usuarioActual = signal<string | null>(this.obtenerUsuario());

  tienePermiso(permiso: string): boolean {
    const raw = sessionStorage.getItem(this.PERMISOS_KEY) ?? localStorage.getItem(this.PERMISOS_KEY);
    if (!raw) {
      return false;
    }
    try {
      const permisos = JSON.parse(raw) as string[];
      return Array.isArray(permisos) && permisos.includes(permiso);
    } catch {
      return false;
    }
  }

  obtenerPermisos(): string[] {
    const raw = sessionStorage.getItem(this.PERMISOS_KEY) ?? localStorage.getItem(this.PERMISOS_KEY);
    if (!raw) return [];
    try {
      const permisos = JSON.parse(raw);
      return Array.isArray(permisos) ? permisos : [];
    } catch {
      return [];
    }
  }

  obtenerToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY) ?? localStorage.getItem(this.TOKEN_KEY);
  }

  obtenerUsuario(): string | null {
    return sessionStorage.getItem(this.USUARIO_KEY) ?? localStorage.getItem(this.USUARIO_KEY);
  }

  establecerSesion(token: string, usuario: string, permisos: string[]): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
    sessionStorage.setItem(this.USUARIO_KEY, usuario);
    sessionStorage.setItem(this.PERMISOS_KEY, JSON.stringify(permisos));
    this.usuarioActual.set(usuario);
  }

  establecerPermisos(permisos: string[]): void {
    sessionStorage.setItem(this.PERMISOS_KEY, JSON.stringify(permisos));
    localStorage.setItem(this.PERMISOS_KEY, JSON.stringify(permisos));
  }

  cerrarSesion(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USUARIO_KEY);
    sessionStorage.removeItem(this.PERMISOS_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USUARIO_KEY);
    localStorage.removeItem(this.PERMISOS_KEY);
    this.usuarioActual.set(null);
  }

  esTokenAlteradoOExpirado(): boolean {
    const token = this.obtenerToken();
    if (!token) return true;
    if (token === 'TOKEN_ALTERADO' || token === 'TOKEN_EXPIRADO' || token.length < 15) {
      return true;
    }
    return false;
  }
}
