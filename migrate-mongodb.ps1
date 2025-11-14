# Script para migrar datos de MongoDB Atlas a MongoDB Local
# Magneto Project - Migration Script

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  Migracion de MongoDB Atlas a Local" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Configuracion
$ATLAS_URI = "mongodb+srv://admin:zahC61tzcSqmnsQD@cluster0.oegtrdy.mongodb.net/ProyectoMagento"
$LOCAL_URI = "mongodb://localhost:27017"
$DATABASE_NAME = "jobsy"
$DUMP_DIR = ".\mongodb-backup"
$MONGO_TOOLS_PATH = "C:\Program Files\MongoDB\Tools\100\bin"

# Agregar MongoDB Tools al PATH temporalmente
$env:Path += ";$MONGO_TOOLS_PATH"

# Paso 1: Exportar datos de Atlas
Write-Host "[1/4] Exportando datos desde MongoDB Atlas..." -ForegroundColor Yellow
Write-Host "      Base de datos: ProyectoMagento" -ForegroundColor Gray
Write-Host ""

try {
    # Crear directorio de backup si no existe
    if (Test-Path $DUMP_DIR) {
        Write-Host "      Limpiando backup anterior..." -ForegroundColor Gray
        Remove-Item -Recurse -Force $DUMP_DIR
    }

    # Exportar datos de Atlas
    Write-Host "      Descargando datos de Atlas..." -ForegroundColor Gray
    mongodump --uri="$ATLAS_URI" --out="$DUMP_DIR"
    
    if ($LASTEXITCODE -ne 0) {
        throw "Error al exportar datos de Atlas"
    }
    
    Write-Host "      [OK] Datos exportados exitosamente" -ForegroundColor Green
    Write-Host ""
    
} catch {
    Write-Host "      [ERROR] Error al exportar: $_" -ForegroundColor Red
    exit 1
}

# Paso 2: Verificar que MongoDB local esta corriendo
Write-Host "[2/4] Verificando MongoDB Local..." -ForegroundColor Yellow

$mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue

if ($null -eq $mongoService -or $mongoService.Status -ne "Running") {
    Write-Host "      [ERROR] MongoDB local no esta corriendo" -ForegroundColor Red
    Write-Host "      Ejecuta: Start-Service MongoDB" -ForegroundColor Yellow
    exit 1
}

Write-Host "      [OK] MongoDB local esta corriendo" -ForegroundColor Green
Write-Host ""

# Paso 3: Importar datos a MongoDB local
Write-Host "[3/4] Importando datos a MongoDB Local..." -ForegroundColor Yellow
Write-Host "      Base de datos destino: $DATABASE_NAME" -ForegroundColor Gray
Write-Host ""

try {
    # Importar datos
    Write-Host "      Importando colecciones..." -ForegroundColor Gray
    mongorestore --uri="$LOCAL_URI" --db=$DATABASE_NAME "$DUMP_DIR\ProyectoMagento" --drop
    
    if ($LASTEXITCODE -ne 0) {
        throw "Error al importar datos a MongoDB local"
    }
    
    Write-Host "      [OK] Datos importados exitosamente" -ForegroundColor Green
    Write-Host ""
    
} catch {
    Write-Host "      [ERROR] Error al importar: $_" -ForegroundColor Red
    exit 1
}

# Paso 4: Verificacion
Write-Host "[4/4] Verificando migracion..." -ForegroundColor Yellow
Write-Host ""

# Limpiar directorio de backup
Write-Host "      Limpiando archivos temporales..." -ForegroundColor Gray
if (Test-Path $DUMP_DIR) {
    Remove-Item -Recurse -Force $DUMP_DIR
    Write-Host "      [OK] Limpieza completada" -ForegroundColor Green
}

Write-Host ""
Write-Host "=================================================" -ForegroundColor Green
Write-Host "  MIGRACION COMPLETADA EXITOSAMENTE" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Informacion:" -ForegroundColor Cyan
Write-Host "  - Base de datos local: $DATABASE_NAME" -ForegroundColor White
Write-Host "  - URI: $LOCAL_URI/$DATABASE_NAME" -ForegroundColor White
Write-Host "  - Todos tus usuarios y datos han sido migrados" -ForegroundColor White
Write-Host ""
Write-Host "Siguiente paso:" -ForegroundColor Cyan
Write-Host "  Reinicia tu servidor: npm run server" -ForegroundColor Yellow
Write-Host ""
