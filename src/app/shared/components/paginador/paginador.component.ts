import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-paginador',
  standalone: true,
  templateUrl: './paginador.component.html',
  styleUrl: './paginador.component.css'
})
export class PaginadorComponent {
  readonly pagina = input<number>(0);
  readonly totalPaginas = input<number>(0);
  readonly totalElementos = input<number>(0);
  readonly tamano = input<number>(10);

  readonly cambioPagina = output<number>();

  irAPagina(p: number): void {
    if (p >= 0 && p < this.totalPaginas() && p !== this.pagina()) {
      this.cambioPagina.emit(p);
    }
  }
}
