import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PaginadorComponent } from '../../shared/components/paginador/paginador.component';

export interface ItemVenta {
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

export interface VentaRegistro {
  id: number;
  numeroComprobante: string;
  fecha: string;
  cliente: string;
  total: number;
  usuario: string;
}

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginadorComponent],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Formulario de Venta
  protected cliente = 'Juan Pérez';
  protected productoSeleccionadoId = 1;
  protected cantidad = 1;

  // Catálogo disponible con su stock
  protected productosCatalogo = [
    { id: 1, nombre: 'Paracetamol 500mg', precio: 1.50, stock: 10 },
    { id: 2, nombre: 'Ibuprofeno 400mg', precio: 2.00, stock: 5 },
    { id: 3, nombre: 'Amoxicilina 500mg', precio: 3.50, stock: 0 },
    { id: 4, nombre: 'Azitromicina 500mg', precio: 8.00, stock: 25 }
  ];

  // Carrito de compras
  protected readonly items = signal<ItemVenta[]>([]);
  protected readonly totalVenta = computed(() =>
    this.items().reduce((acc, it) => acc + it.subtotal, 0)
  );

  // Alertas
  protected error409 = signal<string | null>(null);
  protected error400 = signal<string | null>(null);
  protected comprobanteGenerado = signal<VentaRegistro | null>(null);

  // Historial de Ventas con Paginación y Filtro
  protected filtroFechaDesde = '';
  protected filtroFechaHasta = '';
  protected paginaVentas = signal<number>(0);
  protected totalPaginasVentas = signal<number>(5);
  protected totalElementosVentas = signal<number>(45);

  protected readonly ventasHistorial = signal<VentaRegistro[]>([
    { id: 45, numeroComprobante: 'B001-00045', fecha: '2026-11-12 10:15', cliente: 'Juan Pérez', total: 15.00, usuario: 'vendedor' },
    { id: 44, numeroComprobante: 'B001-00044', fecha: '2026-11-12 09:30', cliente: 'María Gómez', total: 24.50, usuario: 'admin' },
    { id: 43, numeroComprobante: 'B001-00043', fecha: '2026-11-11 16:40', cliente: 'Carlos Ruiz', total: 42.00, usuario: 'vendedor' },
    { id: 42, numeroComprobante: 'B001-00042', fecha: '2026-11-11 14:10', cliente: 'Ana Lopez', total: 8.00, usuario: 'vendedor' }
  ]);

  ngOnInit(): void {
    const clienteGuardado = sessionStorage.getItem('ultimoClienteNombre');
    if (clienteGuardado) {
      this.cliente = clienteGuardado;
    }

    this.route.queryParams.subscribe(params => {
      if (params['pagina']) {
        const p = parseInt(params['pagina'], 10);
        if (!isNaN(p)) this.paginaVentas.set(p);
      }
      if (params['desde']) this.filtroFechaDesde = params['desde'];
      if (params['hasta']) this.filtroFechaHasta = params['hasta'];
    });
  }

  agregarProducto(): void {
    this.error409.set(null);
    this.error400.set(null);

    const prod = this.productosCatalogo.find(p => p.id === Number(this.productoSeleccionadoId));
    if (!prod) return;

    if (this.cantidad > prod.stock) {
      this.error409.set(
        `409 Conflict: Stock insuficiente para "${prod.nombre}". Stock disponible: ${prod.stock}, solicitado: ${this.cantidad}.`
      );
      return;
    }

    if (this.cantidad <= 0) {
      this.error400.set('400 Bad Request: La cantidad debe ser mayor a cero.');
      return;
    }

    const subtotal = prod.precio * this.cantidad;
    this.items.update(lista => [
      ...lista,
      {
        productoId: prod.id,
        nombre: prod.nombre,
        precio: prod.precio,
        cantidad: this.cantidad,
        subtotal
      }
    ]);
  }

  eliminarItem(index: number): void {
    this.items.update(lista => lista.filter((_, i) => i !== index));
  }

  registrarVenta(): void {
    this.error409.set(null);
    this.error400.set(null);
    this.comprobanteGenerado.set(null);

    // E2E-09: Venta sin productos -> Error 400
    if (this.items().length === 0) {
      this.error400.set('400 Bad Request: La venta debe contener al menos un producto.');
      return;
    }

    // Verificar stock de nuevo
    for (const item of this.items()) {
      const prod = this.productosCatalogo.find(p => p.id === item.productoId);
      if (prod && item.cantidad > prod.stock) {
        this.error409.set(`409 Conflict: Stock insuficiente para "${item.nombre}".`);
        return;
      }
    }

    // Descontar stock
    for (const item of this.items()) {
      const prod = this.productosCatalogo.find(p => p.id === item.productoId);
      if (prod) {
        prod.stock -= item.cantidad;
      }
    }

    const nuevoId = 46;
    const comprobante: VentaRegistro = {
      id: nuevoId,
      numeroComprobante: `B001-000${nuevoId}`,
      fecha: new Date().toISOString().replace('T', ' ').substring(0, 16),
      cliente: this.cliente,
      total: this.totalVenta(),
      usuario: this.authService.obtenerUsuario() ?? 'vendedor'
    };

    this.ventasHistorial.update(v => [comprobante, ...v]);
    this.comprobanteGenerado.set(comprobante);
    this.items.set([]);
  }

  // E2E-11: Al cambiar fechas vuelve a la página 1 (I-08)
  alCambiarFiltroFechas(): void {
    this.paginaVentas.set(0);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        pagina: 0,
        desde: this.filtroFechaDesde || null,
        hasta: this.filtroFechaHasta || null
      },
      queryParamsHandling: 'merge'
    });
  }

  onCambioPaginaVentas(p: number): void {
    this.paginaVentas.set(p);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { pagina: p },
      queryParamsHandling: 'merge'
    });
  }
}
