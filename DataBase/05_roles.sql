DROP ROLE IF EXISTS app_library;

CREATE ROLE app_library WITH LOGIN PASSWORD 'secure_pass_123';

GRANT CONNECT ON DATABASE lab_db TO app_library;
GRANT USAGE ON SCHEMA public TO app_library;

GRANT SELECT ON reporte_libros_populares TO app_library;
GRANT SELECT ON reporte_usuarios_status TO app_library;
GRANT SELECT ON reporte_ranking_generos TO app_library;
GRANT SELECT ON reporte_prestamos_kpis TO app_library;
GRANT SELECT ON reporte_autores_metricas TO app_library;

REVOKE CREATE ON SCHEMA public FROM app_library;