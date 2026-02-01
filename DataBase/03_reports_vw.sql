-- View 1: Libros Populares
-- Que devuelve: Lista de libros que se han prestado alguna vez.
-- Grain: Una fila por libro.
-- Metricas: Total de veces prestado.
-- Group By: Necesario para contar los prestamos por cada libro.
-- Having: Solo mostramos libros con al menos 1 prestamo.

CREATE VIEW reporte_libros_populares AS
SELECT 
    l.titulo,
    a.nombre AS autor,
    l.genero,
    COUNT(p.id) AS total_prestamos,
    CASE 
        WHEN COUNT(p.id) >= 3 THEN 'Muy Popular'
        ELSE 'Normal'
    END AS popularidad
FROM libros l
JOIN autores a ON l.autor_id = a.id
JOIN prestamos p ON p.libro_id = l.id
GROUP BY l.titulo, a.nombre, l.genero
HAVING COUNT(p.id) >= 1
ORDER BY total_prestamos DESC;

-- View 2: Ranking de Lectores
-- Que devuelve: Usuarios clasificados por cuantos libros leen y su comportamiento.
-- Grain: Una fila por usuario.
-- Metricas: Conteo de prestamos y promedio de retrasos.
-- Group By: Agrupa por usuario para sacar sus estadisticas.
-- Having: Filtra usuarios que nunca han pedido nada.

CREATE VIEW reporte_usuarios_status AS
SELECT 
    u.nombre,
    u.email,
    COUNT(p.id) AS libros_pedidos,
    SUM(p.dias_retraso) AS dias_retraso_total,
    CASE 
        WHEN COUNT(p.id) >= 3 THEN 'Lector Frecuente'
        WHEN SUM(p.dias_retraso) > 5 THEN 'Lector Moroso'
        ELSE 'Lector Casual'
    END AS categoria_lector
FROM usuarios u
JOIN prestamos p ON p.usuario_id = u.id
GROUP BY u.nombre, u.email
HAVING COUNT(p.id) >= 1;

-- View 3: Analisis de Generos (Window Function)
-- Que devuelve: Un ranking de los generos mas leidos.
-- Grain: Una fila por genero.
-- Metricas: Total de prestamos por genero.
-- Window Function: ROW_NUMBER para numerar el ranking y SUM OVER para el porcentaje.

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

-- View 4: Prestamos Activos vs Global (CTE)
-- Que devuelve: Detalle de prestamos actuales comparados con el total historico.
-- Grain: Una fila por prestamo.
-- Metricas: Dias que lleva el libro prestado.
-- CTE: Se usa para calcular primero cuantos prestamos existen en total en la historia.

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

-- View 5: Rendimiento de Autores
-- Que devuelve: Estadisticas de cada autor.
-- Grain: Una fila por autor.
-- Metricas: Total de libros en stock vs libros prestados.
-- Calculado: Ratio de rotacion (prestamos / stock).

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