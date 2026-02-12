#!/bin/bash
# scripts/verify.sh
# Script de validación rápida para Tarea 6
# Lista las vistas creadas y ejecuta una prueba de humo (smoke test) sobre cada una.

# Cargar variables de entorno (OBLIGATORIO)
if [ ! -f .env ]; then
    echo "ERROR: No se encontró el archivo '.env'."
    echo "Crea uno con: cp .env.example .env"
    exit 1
fi
export $(cat .env | grep -v '#' | awk '/=/ {print $1}')

# Configuración de conexión (leída desde .env)
DB_USER="$POSTGRES_USER"
DB_NAME="$POSTGRES_DB"
# Usamos localhost porque este script se corre desde tu máquina host, no desde dentro del contenedor
DB_HOST="localhost" 
DB_PORT="$POSTGRES_PORT"

# Verificar que psql está instalado
if ! command -v psql &> /dev/null; then
    echo "ERROR: 'psql' no está instalado. Instálalo antes de continuar."
    echo "  macOS:   brew install libpq && brew link --force libpq"
    echo "  Ubuntu:  sudo apt install postgresql-client"
    exit 1
fi

echo "==================================================="
echo "INICIANDO VERIFICACIÓN DE BASE DE DATOS"
echo "Target: $DB_HOST:$DB_PORT/$DB_NAME (User: $DB_USER)"
echo "==================================================="

# Función helper para ejecutar SQL
run_sql() {
    PGPASSWORD="$POSTGRES_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "$1"
}

# 1. Verificar conexión y listar Vistas
echo ""
echo "1. LISTADO DE VISTAS (Check de existencia)"
echo "---------------------------------------------------"
run_sql "\dv"

# 2. Validar View 1: Libros Populares
echo ""
echo "2. VALIDANDO: reporte_libros_populares"
echo "   Query: Top 3 libros más populares"
echo "---------------------------------------------------"
run_sql "SELECT titulo, total_prestamos, popularidad FROM reporte_libros_populares LIMIT 3;"

# 3. Validar View 2: Status Usuarios
echo ""
echo "3. VALIDANDO: reporte_usuarios_status"
echo "   Query: Usuarios con categoría 'Lector Moroso' o top retrasos"
echo "---------------------------------------------------"
run_sql "SELECT nombre, dias_retraso_total, categoria_lector FROM reporte_usuarios_status ORDER BY dias_retraso_total DESC LIMIT 3;"

# 4. Validar View 3: Ranking Géneros
echo ""
echo "4. VALIDANDO: reporte_ranking_generos"
echo "   Query: Ranking completo y participación de mercado"
echo "---------------------------------------------------"
run_sql "SELECT ranking, genero, total_prestamos, porcentaje_del_total FROM reporte_ranking_generos ORDER BY ranking ASC;"

# 5. Validar View 4: KPIs Préstamos
echo ""
echo "5. VALIDANDO: reporte_prestamos_kpis"
echo "   Query: Muestra de préstamos activos y su antigüedad"
echo "---------------------------------------------------"
run_sql "SELECT prestamo_id, usuario, dias_transcurridos, estado FROM reporte_prestamos_kpis LIMIT 3;"

# 6. Validar View 5: Métricas Autores
echo ""
echo "6. VALIDANDO: reporte_autores_metricas"
echo "   Query: Rotación de stock por autor"
echo "---------------------------------------------------"
run_sql "SELECT nombre, stock_total, veces_prestado, rotacion FROM reporte_autores_metricas ORDER BY rotacion DESC LIMIT 3;"

echo ""
echo "==================================================="
echo "VERIFICACIÓN COMPLETADA"
echo "Si viste 5 tablas con datos arriba, tu backend está sano."
echo "==================================================="