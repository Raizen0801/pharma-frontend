import { Routes } from '@angular/router';
import { AuditoriaListComponent } from './pages/auditoria-list/auditoria-list.component';
import { permisoGuard } from '../../core/guards/permiso.guard';

export const AUDITORIA_ROUTES: Routes = [
  {
    path: '',
    component: AuditoriaListComponent,
    title: 'Bitácora de Auditoría - PharmaSoft',
    canActivate: [permisoGuard],
    data: { permiso: 'USUARIOS_ADMINISTRAR' }
  }
];
