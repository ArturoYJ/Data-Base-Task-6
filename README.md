# Sistema de Reportes de Biblioteca

Este proyecto implementa un dashboard de análisis de datos utilizando **Next.js 14**, **PostgreSQL** y **Docker Compose**. El sistema consume Vistas SQL optimizadas para generar reportes de negocio.

## Prerequisitos

- [Docker](https://www.docker.com/products/docker-desktop) y Docker Compose instalados.
- [Git](https://git-scm.com/) instalado.

## Instrucciones de Ejecución

1.  **Clonar el repositorio:**

    ```bash
    git clone https://github.com/ArturoYJ/Data-Base-Task-6.git
    cd Data-Base-Task-6
    ```

2.  **Configurar Variables de Entorno:**
    Copia el archivo de ejemplo y edítalo con tus credenciales:

    ```bash
    cp .env.example .env
    ```

    Abre el archivo `.env` y modifica las variables según tu preferencia. Como mínimo, cambia las contraseñas (`POSTGRES_PASSWORD`, `APP_PASSWORD`) y el nombre de la base de datos (`POSTGRES_DB`). Consulta la sección [Referencia de Variables](#referencia-de-variables-env) para más detalles.

3.  **Levantar con Docker:**

    ```bash
    docker compose up --build
    ```

    Espera a que aparezca el mensaje `✓ Ready` en la terminal, indicando que tanto la base de datos como la aplicación están listas.

4.  **Acceder a la aplicación:** Abre en tu navegador `http://localhost:3000` (o el puerto que hayas configurado en `NEXT_PUBLIC_APP_PORT`).

5.  **Detener el proyecto:**

    ```bash
    docker compose down
    ```

> **Nota:** Si experimentas errores de conexión a la base de datos, ejecuta `docker compose down -v` para eliminar los volúmenes y luego `docker compose up --build` para reinicializar todo desde cero.

## Referencia de Variables (.env)

El archivo `.env` centraliza la configuración. Estas son las variables principales:

- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`: Credenciales de la base de datos.
- `APP_USER`, `APP_PASSWORD`: Usuario limitado para la aplicación (seguridad).
- `NODE_ENV`: Entorno (`development` o `production`). `development` es para el desarrollo y `production` es para la producción.
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

---

## Thread model and security

Para garantizar la integridad del sistema y proteger los datos de la biblioteca, se implementó una estrategia de seguridad en capas (Defense in Depth) cubriendo los siguientes vectores de ataque:

1.  **Principio de Menor Privilegio (Database Layer):**
    - Se creó un rol específico `por defecto: app_library` (ver `05_roles.sql`) que **solo tiene permisos de lectura (`SELECT`)** sobre las Vistas definidas.
    - Este usuario **no tiene acceso directo a las tablas base** ni permisos para ejecutar comandos DDL (como `DROP` o `ALTER`). Esto asegura que, incluso si la aplicación Next.js fuera comprometida, el atacante no podría alterar, eliminar registros ni destruir la estructura de la base de datos.

2.  **Prevención de Inyección SQL (Application Layer):**
    - **Validación de Tipos:** Todas las entradas de usuario (filtros, parámetros de paginación) son validadas estrictamente con **Zod** antes de procesarse. Si el input no coincide con el esquema esperado (ej. un string malicioso en lugar de un número), la petición se rechaza inmediatamente.
    - **Consultas Parametrizadas:** En los Server Actions (`src/lib/actions/report.ts`), se utiliza el protocolo de consultas parametrizadas del driver `pg` (sintaxis `$1`, `$2`). Esto delega la sanitización de los datos al driver de la base de datos, neutralizando cualquier intento de inyección de código SQL a través de los inputs.

3.  **Aislamiento de Secretos (Infrastructure Layer):**
    - Las credenciales sensibles (contraseñas de base de datos, puertos) no están hardcodeadas en el código fuente. Se utilizan **Variables de Entorno** cargadas en tiempo de ejecución.
    - El archivo `.env` está incluido en `.gitignore` para prevenir la filtración accidental de secretos en el repositorio de control de versiones. Se provee un `.env.example` sanitizado para facilitar el despliegue seguro en nuevos entornos.

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

Esta sección documenta el análisis de rendimiento de las vistas SQL mediante `EXPLAIN ANALYZE`, que muestra el plan de ejecución real del motor de PostgreSQL junto con los tiempos de ejecución.

### 1. Análisis de `reporte_libros_populares`

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

**Interpretación:**

- **Hash Join:** PostgreSQL une las tablas `libros ↔ autores` y `libros ↔ prestamos` mediante Hash Joins, un método eficiente para joins de igualdad.
- **HashAggregate:** Agrupa por `titulo`, `nombre` y `genero` para calcular `COUNT(p.id)`, y luego aplica el filtro `CASE` para clasificar la popularidad.
- **Sort (quicksort):** Ordena los resultados por número de préstamos (`DESC`), usando solo 25kB de memoria.
- **Seq Scan:** El motor usa Sequential Scan porque el dataset de prueba es pequeño (5 autores, 9 libros, 10 préstamos). Con volúmenes mayores, PostgreSQL elegiría automáticamente los Index Scans gracias a los índices definidos en `04_indexes.sql`.
- **Execution Time: 1.109 ms** — Tiempo total de ejecución.

---

### 2. Análisis de `reporte_autores_metricas`

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

**Interpretación:**

- **Hash Left Join:** A diferencia del reporte anterior, aquí se usa un `LEFT JOIN` para incluir autores que no tienen préstamos asociados, asegurando que ningún autor quede fuera del reporte.
- **HashAggregate:** Agrupa por `nombre` y `nacionalidad` del autor para calcular las métricas (total de préstamos, promedio, etc.).
- **Sort (quicksort):** Ordena los autores por cantidad de veces prestados (`DESC`), con un uso mínimo de memoria (25kB).
- **Execution Time: 2.554 ms** — Ligeramente mayor que el reporte 1 debido al `LEFT JOIN` adicional.

> **Nota:** Ambos reportes muestran `Seq Scan` (escaneo secuencial) porque el dataset de prueba contiene pocas filas. PostgreSQL determina que para tablas pequeñas es más rápido leer toda la tabla que consultar un índice. Con datasets de producción (miles o millones de registros), el planificador de PostgreSQL aprovechará automáticamente los índices B-Tree definidos en `04_indexes.sql`.

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
