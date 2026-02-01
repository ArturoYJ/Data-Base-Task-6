export interface LibroPopular {
  titulo: string;
  autor: string;
  genero: string;
  total_prestamos: number;
  popularidad: string;
}

export interface UsuarioStatus {
  nombre: string;
  email: string;
  libros_pedidos: number;
  dias_retraso_total: number;
  categoria_lector: string;
}

export interface RankingGenero {
  genero: string;
  total_prestamos: number;
  ranking: number;
  porcentaje_del_total: number;
}

export interface PrestamoKPI {
  prestamo_id: number;
  titulo: string;
  usuario: string;
  fecha_prestamo: string;
  estado: string;
  dias_transcurridos: number;
  total_historico: number;
}

export interface AutorMetrica {
  nombre: string;
  nacionalidad: string;
  stock_total: number;
  veces_prestado: number;
  rotacion: number;
}
