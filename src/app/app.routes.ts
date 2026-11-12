import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      {
        path: 'inicio',
        title: 'Inicio - PharmaSoft',
        loadComponent: () => import('./features/inicio/inicio').then(m => m.Inicio)
      },
      {
        path: 'categorias',
        loadChildren: () => import('./features/categorias/categorias.routes').then(m => m.CATEGORIAS_ROUTES)
      },
      {
        path: 'productos',
        title: 'Productos - PharmaSoft',
        loadComponent: () => import('./features/productos/productos.component').then(m => m.ProductosComponent)
      },
      {
        path: 'clientes',
        title: 'Clientes - PharmaSoft',
        loadComponent: () => import('./features/clientes/clientes.component').then(m => m.ClientesComponent)
      },
      {
        path: 'ventas',
        title: 'Ventas - PharmaSoft',
        loadComponent: () => import('./features/ventas/ventas.component').then(m => m.VentasComponent)
      },
      {
        path: 'auditoria',
        loadChildren: () => import('./features/auditoria/auditoria.routes').then(m => m.AUDITORIA_ROUTES)
      },
      {
        path: 'acceso-denegado',
        title: 'Acceso Denegado - PharmaSoft',
        loadComponent: () => import('./shared/pages/acceso-denegado/acceso-denegado.component').then(m => m.AccesoDenegadoComponent)
      }
    ]
  },
  {
    path: 'login',
    title: 'Iniciar Sesión - PharmaSoft',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '**',
    title: 'Página no encontrada',
    loadComponent: () => import('./shared/pages/no-encontrado/no-encontrado').then(m => m.NoEncontrado)
  }
];
