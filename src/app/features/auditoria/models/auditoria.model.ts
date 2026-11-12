export interface AuditoriaItem {
  id: number;
  fechaHora: string;
  usuario: string;
  accion: string;
  entidad: string;
  entidadId: number;
  detalle: string;
  ip?: string;
}

export interface PaginaAuditoria {
  contenido: AuditoriaItem[];
  pagina: number;
  tamano: number;
  totalElementos: number;
  totalPaginas: number;
  primera: boolean;
  ultima: boolean;
}
