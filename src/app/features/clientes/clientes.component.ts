import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

export interface Cliente {
  id: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombreCompleto: string;
  telefono: string;
}

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {
  protected dni = '';
  protected nombre = '';
  protected telefono = '';
  protected mensajeExito = signal<string | null>(null);

  protected readonly clientes = signal<Cliente[]>([
    { id: 1, tipoDocumento: 'DNI', numeroDocumento: '12345678', nombreCompleto: 'Juan Pérez', telefono: '987654321' },
    { id: 2, tipoDocumento: 'DNI', numeroDocumento: '87654321', nombreCompleto: 'María Gómez', telefono: '912345678' }
  ]);

  constructor(private router: Router) {}

  registrarCliente(): void {
    if (!this.dni || !this.nombre) return;

    const nuevo: Cliente = {
      id: this.clientes().length + 1,
      tipoDocumento: 'DNI',
      numeroDocumento: this.dni,
      nombreCompleto: this.nombre,
      telefono: this.telefono
    };

    this.clientes.update(c => [nuevo, ...c]);
    this.mensajeExito.set(`Cliente ${this.nombre} (DNI: ${this.dni}) registrado con éxito.`);

    // Limpiar formulario
    const dniGuardado = this.dni;
    const nombreGuardado = this.nombre;
    this.dni = '';
    this.nombre = '';
    this.telefono = '';

    // Guardar último cliente en sessionStorage para auto-seleccionar en ventas
    sessionStorage.setItem('ultimoClienteDni', dniGuardado);
    sessionStorage.setItem('ultimoClienteNombre', nombreGuardado);
  }

  irAVentaConCliente(cliente: Cliente): void {
    sessionStorage.setItem('ultimoClienteDni', cliente.numeroDocumento);
    sessionStorage.setItem('ultimoClienteNombre', cliente.nombreCompleto);
    this.router.navigate(['/ventas']);
  }
}
