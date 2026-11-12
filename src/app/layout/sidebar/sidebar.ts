import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MENU } from '../../core/config/menu';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  private readonly authService = inject(AuthService);

  protected readonly menu = computed(() => {
    this.authService.usuarioActual();
    return MENU.filter(item => !item.permiso || this.authService.tienePermiso(item.permiso));
  });
}
