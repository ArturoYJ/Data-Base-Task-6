# Sistema de Reportes de Biblioteca

Este proyecto implementa un dashboard de análisis de datos utilizando **Next.js 14**, **PostgreSQL** y **Docker Compose**. El sistema consume Vistas SQL optimizadas para generar reportes de negocio.

## Instrucciones de Ejecución

1.  **Clonar el repositorio:** Asegúrate de estar en la carpeta raíz.
2.  **Levantar con Docker:** No se requiere instalación local de Node o Postgres.
    ```bash
    docker compose up --build
    ```
3.  **Acceder:** Abre `http://localhost:3000` en tu navegador.

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
