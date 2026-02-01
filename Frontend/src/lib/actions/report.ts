'use server'

import { pool } from '@/lib/db/db';
import { filtroLibrosSchema, paginacionSchema } from '@/lib/validations/schemas';

export async function getLibrosPopulares(formData: FormData) {
  const popularidad = formData.get('popularidad')?.toString() || 'Todos';

  let query = 'SELECT * FROM reporte_libros_populares';
  const params: string[] = [];

  if (popularidad !== 'Todos') {
    query += ' WHERE popularidad = $1';
    params.push(popularidad);
  }

  try {
    const result = await pool.query(query, params);
    return { success: true, data: result.rows };
  } catch (error) {
    return { success: false, error: 'Error al cargar libros' };
  }
}

export async function getPrestamos(page: number = 1) {
  const limit = 5;
  const offset = (page - 1) * limit;

  try {
    const query = `
      SELECT * FROM reporte_prestamos_kpis
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);

    const countResult = await pool.query('SELECT COUNT(*) FROM reporte_prestamos_kpis');
    const total = parseInt(countResult.rows[0].count);

    return {
      success: true,
      data: result.rows,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    return { success: false, error: 'Error cargando préstamos' };
  }
}

export async function getUsuariosStatus(formData: FormData) {
  const categoria = formData.get('categoria')?.toString() || 'Todos';
  
  let query = 'SELECT * FROM reporte_usuarios_status';
  const params: string[] = [];

  if (categoria !== 'Todos') {
    query += ' WHERE categoria_lector = $1';
    params.push(categoria);
  }

  query += ' ORDER BY dias_retraso_total DESC LIMIT 20';

  try {
    const result = await pool.query(query, params);
    return { success: true, data: result.rows };
  } catch (error) {
    return { success: false, error: 'Error al cargar usuarios' };
  }
}

export async function getRankingGeneros() {
  try {
    const result = await pool.query('SELECT * FROM reporte_ranking_generos ORDER BY ranking ASC');
    return { success: true, data: result.rows };
  } catch (error) {
    return { success: false, error: 'Error al cargar géneros' };
  }
}

export async function getAutoresMetricas(page: number = 1) {
  const limit = 5;
  const offset = (page - 1) * limit;

  try {
    const query = 'SELECT * FROM reporte_autores_metricas ORDER BY veces_prestado DESC LIMIT $1 OFFSET $2';
    const result = await pool.query(query, [limit, offset]);
    
    const countResult = await pool.query('SELECT COUNT(*) FROM reporte_autores_metricas');
    const total = parseInt(countResult.rows[0].count);

    return { 
      success: true, 
      data: result.rows,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    return { success: false, error: 'Error al cargar autores' };
  }
}