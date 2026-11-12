import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected usuario = 'admin';
  protected password = '';
  protected sesionExpirada = signal(false);
  protected error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['expirada'] === 'true' || this.authService.esTokenAlteradoOExpirado()) {
        this.sesionExpirada.set(true);
        this.authService.cerrarSesion();
      }
    });
  }

  iniciarSesion(): void {
    this.error.set(null);
    if (!this.usuario) {
      this.error.set('Ingrese el usuario');
      return;
    }

    if (this.usuario.toLowerCase().includes('admin')) {
      this.entrarComoAdmin();
    } else {
      this.entrarComoVendedor();
    }
  }

  entrarComoAdmin(): void {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInJvbCI6IlJPTEVfQURNSU4ifQ.demo';
    const permisos = ['USUARIOS_ADMINISTRAR', 'PRODUCTOS_LEER', 'PRODUCTOS_ESCRIBIR', 'VENTAS_REGISTRAR', 'CATEGORIAS_LEER'];
    this.authService.establecerSesion(token, 'admin', permisos);
    this.router.navigate(['/inicio']);
  }

  entrarComoVendedor(): void {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2ZW5kZWRvciIsInJvbCI6IlJPTEVfVkVOREVET1IifQ.demo';
    const permisos = ['VENTAS_REGISTRAR', 'PRODUCTOS_LEER', 'CATEGORIAS_LEER'];
    this.authService.establecerSesion(token, 'vendedor', permisos);
    this.router.navigate(['/inicio']);
  }
}
