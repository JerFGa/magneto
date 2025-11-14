# Script para verificar y gestionar MongoDB local

Write-Host "🔍 Verificando estado de MongoDB..." -ForegroundColor Cyan

# Verificar si el servicio MongoDB existe
$mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue

if ($null -eq $mongoService) {
    Write-Host "❌ MongoDB no está instalado como servicio" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 Instala MongoDB Community Edition desde:" -ForegroundColor Yellow
    Write-Host "   https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "✅ Asegúrate de marcar 'Install MongoDB as a Service' durante la instalación" -ForegroundColor Green
    exit 1
}

Write-Host "✅ MongoDB está instalado" -ForegroundColor Green
Write-Host "Estado actual: $($mongoService.Status)" -ForegroundColor Yellow

if ($mongoService.Status -ne "Running") {
    Write-Host ""
    Write-Host "🚀 Intentando iniciar MongoDB..." -ForegroundColor Cyan
    try {
        Start-Service -Name "MongoDB"
        Write-Host "✅ MongoDB iniciado exitosamente" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error al iniciar MongoDB: $_" -ForegroundColor Red
        Write-Host "   Intenta ejecutar PowerShell como Administrador" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "✅ MongoDB ya está corriendo" -ForegroundColor Green
}

Write-Host ""
Write-Host "📊 Información de conexión:" -ForegroundColor Cyan
Write-Host "   URI: mongodb://localhost:27017" -ForegroundColor White
Write-Host "   Base de datos: jobsy" -ForegroundColor White
Write-Host ""
Write-Host "🎉 MongoDB está listo para usar!" -ForegroundColor Green
