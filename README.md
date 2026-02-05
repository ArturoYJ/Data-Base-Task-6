# Sistema de Reportes de Biblioteca

Este proyecto implementa un dashboard de análisis de datos utilizando **Next.js 14**, **PostgreSQL** y **Docker Compose**. El sistema consume Vistas SQL optimizadas para generar reportes de negocio.

## Instrucciones de Ejecución

1.  **Clonar el repositorio:** Asegúrate de estar en la carpeta raíz.

2.  **Configurar Variables de Entorno:**
    Copia el archivo de ejemplo para crear tu configuración local:

    ```bash
    cp .env.example .env
    ```

3.  **Levantar con Docker:**

    ```bash
    docker compose up --build
    ```

4.  **Acceder:** Abre `http://localhost:3000` en tu navegador.

## Referencia de Variables (.env)

El archivo `.env` centraliza la configuración. Estas son las variables principales:

- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`: Credenciales de la base de datos.
- `APP_USER`, `APP_PASSWORD`: Usuario limitado para la aplicación (seguridad).
- `NODE_ENV`: Entorno (`development` o `production`).
- `NEXT_PUBLIC_APP_PORT`: Puerto donde correrá la web (default: 3000).
- `POSTGRES_PORT`: Puerto expuesto de la BD (default: 5432).

## Decisiones Técnicas y Optimización

### Justificación de Índices SQL

Para cumplir con el rendimiento en grandes volúmenes de datos, se crearon los siguientes índices (ver `04_indexes.sql`), justificados mediante análisis de `EXPLAIN`:

1.  **`idx_prestamos_usuario` (B-Tree en `prestamos.usuario_id`)**
    - **Motivo:** Las vistas `reporte_usuarios_status` realizan JOINs masivos entre la tabla de hechos (`prestamos`) y dimensiones (`usuarios`).
    - **Impacto:** Evita un _Sequential Scan_ completo en la tabla de préstamos al filtrar o agrupar por usuario, convirtiéndolo en un _Index Scan_ mucho más rápido.

2.  **`idx_prestamos_libro` (B-Tree en `prestamos.libro_id`)**
    - **Motivo:** Crítico para la vista `reporte_libros_populares`.
    - **Impacto:** Acelera el conteo de préstamos por libro (`COUNT(p.id)`), reduciendo el costo de agregación.

3.  **`idx_libros_genero` (B-Tree en `libros.genero`)**
    - **Motivo:** La vista `reporte_ranking_generos` utiliza Window Functions particionadas o agrupadas por género.
    - **Impacto:** Al tener los datos pre-ordenados por el índice, el motor de base de datos optimiza la operación `GROUP BY`, reduciendo el uso de memoria de ordenamiento (Sort Memory).

### Seguridad

- La aplicación se conecta a la base de datos utilizando el rol `app_library`.
- Este rol tiene permisos restringidos (GRANT SELECT) exclusivamente sobre las Vistas, protegiendo las tablas base de modificaciones accidentales o inyecciones SQL destructivas.

---

## Trade-offs y Decisiones de Diseño

### Lógica de Negocio en SQL (Views) vs. Cliente (JS)

- **Decisión:** Se optó por encapsular la lógica de clasificación (ej. categorías 'Lector Moroso', 'Muy Popular') dentro de las Vistas SQL utilizando sentencias `CASE` y `Window Functions`.
- **Por qué:** Esto centraliza las reglas de negocio en la capa de datos (Single Source of Truth), aprovechando la eficiencia del motor de PostgreSQL para agregaciones masivas antes de que los datos viajen por la red.
- **Trade-off:** Aumenta la complejidad del SQL y requiere migraciones para cambios simples de lógica, a cambio de un Frontend más ligero y "tonto" que solo renderiza datos.

### Paginación con LIMIT/OFFSET en Server Actions

- **Decisión:** Se implementó paginación en el servidor (`report.ts`) enviando solo los registros necesarios.
- **Por qué:** Reduce drásticamente el uso de memoria en el servidor Node.js y el tiempo de carga inicial comparado con traer todos los datos y filtrar en el cliente.
- **Trade-off:** El enfoque `OFFSET` puede ser ineficiente en tablas con millones de registros (escaneo secuencial previo), pero es la solución más pragmática y simple para el volumen de datos de este reporte.

### Validación Híbrida (Zod + SQL Constraints)

- **Decisión:** Se validan los filtros de entrada con Zod en Next.js antes de consultar la BD.
- **Por qué:** Evita ejecuciones innecesarias de queries con parámetros inválidos (Fail Fast).

---

## Performance Evidence

Esta sección documenta el análisis de rendimiento de las vistas SQL mediante `EXPLAIN ANALYZE`.

### 1. Análisis de Índices

Ejecuta el siguiente comando en tu cliente PostgreSQL (`psql`) para verificar el uso de índices en la vista de libros populares:

```sql
EXPLAIN ANALYZE SELECT * FROM reporte_libros_populares WHERE popularidad = 'Muy Popular';
```

**Resultado:**

```
                                                                   QUERY PLAN
------------------------------------------------------------------------------------------------------------------------------------------------
 Sort  (cost=15.95..15.96 rows=1 width=694) (actual time=0.637..0.642 rows=3 loops=1)
   Sort Key: (count(p.id)) DESC
   Sort Method: quicksort  Memory: 25kB
   ->  HashAggregate  (cost=15.77..15.94 rows=1 width=694) (actual time=0.475..0.482 rows=3 loops=1)
         Group Key: l.titulo, a.nombre, l.genero
         Filter: ((count(p.id) >= 1) AND (CASE WHEN (count(p.id) >= 2) THEN 'Muy Popular'::text ELSE 'Normal'::text END = 'Muy Popular'::text))
         Batches: 1  Memory Usage: 24kB
         Rows Removed by Filter: 4
         ->  Hash Join  (cost=2.43..15.67 rows=10 width=658) (actual time=0.439..0.449 rows=10 loops=1)
               Hash Cond: (l.id = p.libro_id)
               ->  Hash Join  (cost=1.20..14.32 rows=9 width=658) (actual time=0.207..0.215 rows=9 loops=1)
                     Hash Cond: (a.id = l.autor_id)
                     ->  Seq Scan on autores a  (cost=0.00..12.20 rows=220 width=222) (actual time=0.033..0.034 rows=5 loops=1)
                     ->  Hash  (cost=1.09..1.09 rows=9 width=444) (actual time=0.088..0.088 rows=9 loops=1)
                           Buckets: 1024  Batches: 1  Memory Usage: 9kB
                           ->  Seq Scan on libros l  (cost=0.00..1.09 rows=9 width=444) (actual time=0.032..0.035 rows=9 loops=1)
               ->  Hash  (cost=1.10..1.10 rows=10 width=8) (actual time=0.131..0.131 rows=10 loops=1)
                     Buckets: 1024  Batches: 1  Memory Usage: 9kB
                     ->  Seq Scan on prestamos p  (cost=0.00..1.10 rows=10 width=8) (actual time=0.071..0.074 rows=10 loops=1)
 Planning Time: 2.034 ms
 Execution Time: 1.109 ms
(21 rows)
```

---

### 2. Análisis de Agregaciones

Ejecuta el siguiente comando para analizar el costo del `GROUP BY` en la vista de métricas de autores:

```sql
EXPLAIN ANALYZE SELECT * FROM reporte_autores_metricas;
```

**Resultado:**

```
                                                           QUERY PLAN
---------------------------------------------------------------------------------------------------------------------------------
 Sort  (cost=16.16..16.18 rows=10 width=384) (actual time=2.341..2.344 rows=5 loops=1)
   Sort Key: (count(p.id)) DESC
   Sort Method: quicksort  Memory: 25kB
   ->  HashAggregate  (cost=15.77..15.99 rows=10 width=384) (actual time=2.273..2.279 rows=5 loops=1)
         Group Key: a.nombre, a.nacionalidad
         Batches: 1  Memory Usage: 24kB
         ->  Hash Left Join  (cost=2.43..15.67 rows=10 width=344) (actual time=0.128..0.134 rows=12 loops=1)
               Hash Cond: (l.id = p.libro_id)
               ->  Hash Join  (cost=1.20..14.32 rows=9 width=344) (actual time=0.082..0.085 rows=9 loops=1)
                     Hash Cond: (a.id = l.autor_id)
                     ->  Seq Scan on autores a  (cost=0.00..12.20 rows=220 width=340) (actual time=0.015..0.016 rows=5 loops=1)
                     ->  Hash  (cost=1.09..1.09 rows=9 width=12) (actual time=0.039..0.039 rows=9 loops=1)
                           Buckets: 1024  Batches: 1  Memory Usage: 9kB
                           ->  Seq Scan on libros l  (cost=0.00..1.09 rows=9 width=12) (actual time=0.026..0.027 rows=9 loops=1)
               ->  Hash  (cost=1.10..1.10 rows=10 width=8) (actual time=0.024..0.025 rows=10 loops=1)
                     Buckets: 1024  Batches: 1  Memory Usage: 9kB
                     ->  Seq Scan on prestamos p  (cost=0.00..1.10 rows=10 width=8) (actual time=0.019..0.019 rows=10 loops=1)
 Planning Time: 2.876 ms
 Execution Time: 2.554 ms
(19 rows)
```

---

## Evidencia de Base de Datos

### Estructura de Vistas

Esta sección documenta las vistas creadas en la base de datos. Ejecuta el comando `\dv` en `psql` para listar las vistas disponibles:

```
                  List of relations
 Schema |           Name           | Type |  Owner
--------+--------------------------+------+----------
 public | reporte_autores_metricas | view | postgres
 public | reporte_libros_populares | view | postgres
 public | reporte_prestamos_kpis   | view | postgres
 public | reporte_ranking_generos  | view | postgres
 public | reporte_usuarios_status  | view | postgres
(5 rows)
```
