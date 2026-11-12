import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {
  protected readonly productos = signal<Producto[]>([
    { id: 1, nombre: 'Paracetamol 500mg', categoria: 'Analgésicos', precio: 1.50, stock: 10 },
    { id: 2, nombre: 'Ibuprofeno 400mg', categoria: 'Antiinflamatorios', precio: 2.00, stock: 5 },
    { id: 3, nombre: 'Amoxicilina 500mg', categoria: 'Antibióticos', precio: 3.50, stock: 0 },
    { id: 4, nombre: 'Azitromicina 500mg', categoria: 'Antibióticos', precio: 8.00, stock: 25 },
    { id: 5, nombre: 'Omeprazol 20mg', categoria: 'Gastroenterología', precio: 2.50, stock: 40 }
  ]);
}
