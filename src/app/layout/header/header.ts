import { Component, computed, inject, output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly toggleMenu = output<void>();

  protected readonly usuario = computed(() => this.authService.usuarioActual() ?? 'Invitado');
  protected readonly estaAutenticado = computed(() => this.authService.usuarioActual() !== null);

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
