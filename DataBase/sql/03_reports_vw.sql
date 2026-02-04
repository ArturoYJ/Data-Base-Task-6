/*
  VIEW: reporte_libros_populares
  DESCRIPCIÓN: Muestra un listado de libros con su conteo histórico de préstamos y una clasificación de popularidad.
  GRAIN: Una fila por libro único (Título + Autor + Género).
  MÉTRICAS: 
    - total_prestamos: Conteo simple de veces que el libro ha sido prestado (COUNT).
    - popularidad: Categorización cualitativa (CASE) basada en el volumen de préstamos.
  POR QUÉ GROUP BY/HAVING: 
    - GROUP BY: Necesario para colapsar todos los registros individuales de la tabla 'prestamos' hacia su libro correspondiente.
    - HAVING: Filtra para mostrar solo libros que han tenido al menos 1 movimiento (evita ruido de inventario muerto).
  VERIFY QUERY: 
    -- Verificar conteo para '1984':
    SELECT count(*) FROM prestamos p JOIN libros l ON p.libro_id = l.id WHERE l.titulo = '1984';
*/
CREATE VIEW reporte_libros_populares AS
SELECT 
    l.titulo,
    a.nombre AS autor,
    l.genero,
    COUNT(p.id) AS total_prestamos,
    CASE 
        WHEN COUNT(p.id) >= 2 THEN 'Muy Popular'
        ELSE 'Normal'
    END AS popularidad
FROM libros l
JOIN autores a ON l.autor_id = a.id
JOIN prestamos p ON p.libro_id = l.id
GROUP BY l.titulo, a.nombre, l.genero
HAVING COUNT(p.id) >= 1
ORDER BY total_prestamos DESC;

/*
  VIEW: reporte_usuarios_status
  DESCRIPCIÓN: Identifica el comportamiento de los usuarios basándose en su historial de devoluciones y volumen de lectura.
  GRAIN: Una fila por usuario registrado.
  MÉTRICAS: 
    - libros_pedidos: Cantidad total de préstamos históricos.
    - dias_retraso_total: Suma acumulada de días de mora (SUM).
    - categoria_lector: Segmentación de usuario (Moroso, Frecuente, Casual) usando lógica condicional compleja (CASE).
  POR QUÉ GROUP BY/HAVING: 
    - GROUP BY: Agrupa todas las transacciones de préstamos por usuario para obtener totales acumulados.
    - HAVING: Asegura que solo analizamos usuarios activos (al menos 1 préstamo).
  VERIFY QUERY: 
    -- Verificar días de retraso para 'Luis Gomez':
    SELECT SUM(dias_retraso) FROM prestamos WHERE usuario_id = (SELECT id FROM usuarios WHERE nombre = 'Luis Gomez');
*/
CREATE VIEW reporte_usuarios_status AS
SELECT 
    u.nombre,
    u.email,
    COUNT(p.id) AS libros_pedidos,
    SUM(p.dias_retraso) AS dias_retraso_total,
    CASE 
        WHEN SUM(p.dias_retraso) > 5 THEN 'Lector Moroso'
        WHEN COUNT(p.id) >= 2 THEN 'Lector Frecuente'
        ELSE 'Lector Casual'
    END AS categoria_lector
FROM usuarios u
JOIN prestamos p ON p.usuario_id = u.id
GROUP BY u.nombre, u.email
HAVING COUNT(p.id) >= 1;

/*
  VIEW: reporte_ranking_generos
  DESCRIPCIÓN: Analiza la participación de mercado de cada género literario dentro de la biblioteca.
  GRAIN: Una fila por género literario.
  MÉTRICAS: 
    - total_prestamos: Demanda absoluta del género.
    - ranking: Posición ordinal basada en demanda (Window Function ROW_NUMBER).
    - porcentaje_del_total: Cuota de mercado calculada sobre el total global (Window Function SUM OVER).
  POR QUÉ GROUP BY: 
    - GROUP BY: Consolida los préstamos individuales en categorías de género para permitir el conteo.
    - Las Window Functions se aplican POSTERIORMENTE sobre estos grupos para calcular el % relativo.
  VERIFY QUERY: 
    -- Verificar total de Ciencia Ficción:
    SELECT count(*) FROM prestamos p JOIN libros l ON p.libro_id = l.id WHERE l.genero = 'Ciencia Ficción';
*/
CREATE VIEW reporte_ranking_generos AS
SELECT 
    l.genero,
    COUNT(p.id) AS total_prestamos,
    ROW_NUMBER() OVER (ORDER BY COUNT(p.id) DESC) AS ranking,
    ROUND(
        COUNT(p.id) * 100.0 / NULLIF(SUM(COUNT(p.id)) OVER (), 0), 
        2
    ) AS porcentaje_del_total
FROM libros l
JOIN prestamos p ON p.libro_id = l.id
GROUP BY l.genero;

/*
  VIEW: reporte_prestamos_kpis
  DESCRIPCIÓN: Tablero operativo de préstamos activos o problemáticos, enriquecido con contexto global.
  GRAIN: Una fila por préstamo individual activo (pendiente o retrasado).
  MÉTRICAS: 
    - dias_transcurridos: Campo calculado de antigüedad (fecha actual - fecha préstamo).
    - total_historico: Métrica global inyectada vía CTE para contexto.
  USO DE ESTRUCTURAS:
    - CTE (WITH): Se utiliza para calcular el 'total_historico' de forma aislada antes de unirlo a los datos detalle.
    - NO GROUP BY (Principal): Esta es una vista transaccional de detalle; se busca ver cada préstamo individualmente, no agruparlos.
  VERIFY QUERY: 
    -- Validar días transcurridos para préstamo ID 1:
    SELECT (CURRENT_DATE - fecha_prestamo) FROM prestamos WHERE id = 1;
*/
CREATE VIEW reporte_prestamos_kpis AS
WITH conteo_global AS (
    SELECT COUNT(*) AS total_historico FROM prestamos
)
SELECT 
    p.id AS prestamo_id,
    l.titulo,
    u.nombre AS usuario,
    p.fecha_prestamo,
    p.estado,
    (CURRENT_DATE - p.fecha_prestamo) AS dias_transcurridos,
    cg.total_historico
FROM prestamos p
JOIN libros l ON p.libro_id = l.id
JOIN usuarios u ON p.usuario_id = u.id
CROSS JOIN conteo_global cg
WHERE p.estado IN ('pendiente', 'retrasado');

/*
  VIEW: reporte_autores_metricas
  DESCRIPCIÓN: Mide la eficiencia del catálogo por autor, comparando stock disponible vs. demanda real (rotación).
  GRAIN: Una fila por Autor.
  MÉTRICAS: 
    - stock_total: Cantidad física de libros disponibles (SUM).
    - veces_prestado: Demanda histórica (COUNT).
    - rotacion: Ratio de eficiencia (Préstamos / Stock). Muestra qué tanto "gira" el inventario.
  POR QUÉ GROUP BY: 
    - GROUP BY: Necesario para agregar datos de dos fuentes distintas (stock de tabla libros y uso de tabla préstamos) bajo una sola entidad (Autor).
  VERIFY QUERY: 
    -- Verificar stock total de 'Isaac Asimov':
    SELECT SUM(stock) FROM libros WHERE autor_id = (SELECT id FROM autores WHERE nombre = 'Isaac Asimov');
*/
CREATE VIEW reporte_autores_metricas AS
SELECT 
    a.nombre,
    a.nacionalidad,
    SUM(l.stock) AS stock_total,
    COUNT(p.id) AS veces_prestado,
    ROUND(COUNT(p.id)::numeric / NULLIF(SUM(l.stock), 0), 2) AS rotacion
FROM autores a
JOIN libros l ON l.autor_id = a.id
LEFT JOIN prestamos p ON p.libro_id = l.id
GROUP BY a.nombre, a.nacionalidad
ORDER BY veces_prestado DESC;