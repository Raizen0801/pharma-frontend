import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MasVendidos } from './mas-vendidos';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, MasVendidos],
  templateUrl: './inicio.html'
})
export class Inicio {
  protected readonly auth = inject(AuthService);
}
