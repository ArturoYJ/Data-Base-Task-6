#!/bin/bash
# Script wrapper para procesar archivos SQL con variables de entorno
# Este script reemplaza placeholders en los archivos SQL antes de ejecutarlos

set -e

echo "🔧 Procesando archivos SQL con variables de entorno..."

# Directorio donde están los archivos SQL originales
SQL_DIR="/docker-entrypoint-initdb.d"

# Directorio temporal para archivos procesados
TEMP_DIR="/tmp/processed_sql"
mkdir -p "$TEMP_DIR"

# Procesar cada archivo SQL
for sql_file in "$SQL_DIR"/*.sql; do
    if [ -f "$sql_file" ]; then
        filename=$(basename "$sql_file")
        echo "   Procesando: $filename"
        
        # Reemplazar variables de entorno en el archivo SQL
        envsubst < "$sql_file" > "$TEMP_DIR/$filename"
        
        # Ejecutar el archivo SQL procesado
        psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" < "$TEMP_DIR/$filename"
    fi
done

echo "✅ Todos los archivos SQL han sido procesados correctamente"
