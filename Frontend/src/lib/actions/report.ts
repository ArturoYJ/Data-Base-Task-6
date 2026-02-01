'use server'

import { pool } from '@/lib/db/db';
import { filtroLibrosSchema, filtroUsuariosSchema } from '@/lib/validations/schemas';

// REPORTE 1: Con Validación Zod
export async function getLibrosPopulares(formData: FormData) {
  const rawData = {
    popularidad: formData.get('popularidad')?.toString()
  };

  const validation = filtroLibrosSchema.safeParse(rawData);
  
  const popularidad = validation.success && validation.data.popularidad 
    ? validation.data.popularidad 
    : 'Todos';

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
    console.error(error);
    return { success: false, error: 'Error al cargar libros' };
  }
}

// REPORTE 2: Con Validación Zod
export async function getUsuariosStatus(formData: FormData) {
  const rawData = {
    categoria: formData.get('categoria')?.toString()
  };

  const validation = filtroUsuariosSchema.safeParse(rawData);
  
  const categoria = validation.success && validation.data.categoria
    ? validation.data.categoria
    : 'Todos';
  
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

// REPORTE 3
export async function getRankingGeneros() {
  try {
    const result = await pool.query('SELECT * FROM reporte_ranking_generos ORDER BY ranking ASC');
    return { success: true, data: result.rows };
  } catch (error) {
    console.error('Error en getRankingGeneros:', error);
    return { success: false, error: 'Error al cargar géneros' };
  }
}

// REPORTE 4
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

// REPORTE 5
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