import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditoriaService } from '../../services/auditoria.service';
import { AuditoriaItem, PaginaAuditoria } from '../../models/auditoria.model';
import { PaginadorComponent } from '../../../../shared/components/paginador/paginador.component';

@Component({
  selector: 'app-auditoria-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginadorComponent],
  templateUrl: './auditoria-list.component.html',
  styleUrl: './auditoria-list.component.css'
})
export class AuditoriaListComponent implements OnInit {
  private readonly auditoriaService = inject(AuditoriaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Filtros
  protected filtroUsuario = '';
  protected filtroAccion = '';
  protected filtroDesde = '';
  protected filtroHasta = '';

  // Estado
  protected readonly registros = signal<AuditoriaItem[]>([]);
  protected readonly pagina = signal<number>(0);
  protected readonly tamano = signal<number>(10);
  protected readonly totalPaginas = signal<number>(0);
  protected readonly totalElementos = signal<number>(0);
  protected readonly cargando = signal<boolean>(false);

  readonly accionesDisponibles = [
    'VENTA_REGISTRADA',
    'CLIENTE_REGISTRADO',
    'CATEGORIA_ELIMINADA',
    'PRODUCTO_CREADO'
  ];

  ngOnInit(): void {
    // Sincronización bidireccional con Query Params en la URL
    this.route.queryParams.subscribe(params => {
      this.filtroUsuario = params['usuario'] || '';
      this.filtroAccion = params['accion'] || '';
      this.filtroDesde = params['desde'] || '';
      this.filtroHasta = params['hasta'] || '';
      const p = params['pagina'] ? parseInt(params['pagina'], 10) : 0;
      this.pagina.set(isNaN(p) || p < 0 ? 0 : p);

      this.cargarDatos();
    });
  }

  cargarDatos(): void {
    this.cargando.set(true);
    this.auditoriaService
      .listar(
        this.pagina(),
        this.tamano(),
        this.filtroUsuario,
        this.filtroAccion,
        this.filtroDesde,
        this.filtroHasta
      )
      .subscribe({
        next: (data: PaginaAuditoria) => {
          this.registros.set(data.contenido);
          this.pagina.set(data.pagina);
          this.tamano.set(data.tamano);
          this.totalPaginas.set(data.totalPaginas);
          this.totalElementos.set(data.totalElementos);
          this.cargando.set(false);
        },
        error: () => {
          this.cargando.set(false);
        }
      });
  }

  aplicarFiltros(): void {
    this.actualizarUrl(0);
  }

  limpiarFiltros(): void {
    this.filtroUsuario = '';
    this.filtroAccion = '';
    this.filtroDesde = '';
    this.filtroHasta = '';
    this.actualizarUrl(0);
  }

  onCambioPagina(nuevaPagina: number): void {
    this.actualizarUrl(nuevaPagina);
  }

  private actualizarUrl(nuevaPagina: number): void {
    const queryParams: Record<string, string | number | null> = {
      pagina: nuevaPagina > 0 ? nuevaPagina : null,
      usuario: this.filtroUsuario.trim() ? this.filtroUsuario.trim() : null,
      accion: this.filtroAccion ? this.filtroAccion : null,
      desde: this.filtroDesde ? this.filtroDesde : null,
      hasta: this.filtroHasta ? this.filtroHasta : null
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'replace'
    });
  }

  obtenerClaseAccion(accion: string): string {
    switch (accion) {
      case 'VENTA_REGISTRADA':
        return 'badge-venta';
      case 'CLIENTE_REGISTRADO':
        return 'badge-cliente';
      case 'CATEGORIA_ELIMINADA':
        return 'badge-categoria';
      case 'PRODUCTO_CREADO':
        return 'badge-producto';
      default:
        return 'badge-default';
    }
  }
}
