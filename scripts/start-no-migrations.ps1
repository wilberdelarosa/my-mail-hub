#!/usr/bin/env pwsh
# Script de inicio SIN aplicar migraciones automáticamente
# Ejecutar: .\start-no-migrations.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Sistema de Facturación Cloud" -ForegroundColor Cyan
Write-Host " ALITO GROUP SRL" -ForegroundColor Cyan
Write-Host " MODO: Sin Migraciones Automáticas" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Docker
Write-Host "1. Verificando Docker Desktop..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "   [OK] Docker Desktop está corriendo" -ForegroundColor Green
}
catch {
    Write-Host "   [ERROR] Docker Desktop NO está corriendo" -ForegroundColor Red
    Write-Host "   Por favor, inicia Docker Desktop y ejecuta este script nuevamente" -ForegroundColor Red
    exit 1
}

# Iniciar servicios complementarios PRIMERO
Write-Host ""
Write-Host "2. Iniciando servicios complementarios (Docker Compose)..." -ForegroundColor Yellow
Set-Location sistema_facturacion

try {
    docker-compose up -d
    Write-Host "   [OK] Servicios iniciados exitosamente" -ForegroundColor Green
}
catch {
    Write-Host "   [ERROR] Error al iniciar servicios" -ForegroundColor Red
    Write-Host "   Mensaje: $_" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Set-Location ..

# Iniciar Supabase CON base de datos LIMPIA (sin migraciones)
Write-Host ""
Write-Host "3. Iniciando Supabase en modo limpio..." -ForegroundColor Yellow
Write-Host "   NOTA: Las migraciones NO se aplicarán automáticamente" -ForegroundColor Yellow
Write-Host ""

# Renombrar temporalmente el directorio de migraciones
$migrationsPath = "supabase\migrations"
$migrationsBackup = "supabase\migrations_backup"

if (Test-Path $migrationsPath) {
    Write-Host "   → Desactivando migraciones temporalmente..." -ForegroundColor Gray
    Rename-Item -Path $migrationsPath -NewName "migrations_backup" -Force
}

try {
    # Iniciar Supabase sin migraciones
    supabase start
    Write-Host "   [OK] Supabase iniciado SIN migraciones" -ForegroundColor Green
}
catch {
    Write-Host "   [ERROR] Error al iniciar Supabase" -ForegroundColor Red
    Write-Host "   Mensaje: $_" -ForegroundColor Red
    
    # Restaurar migraciones
    if (Test-Path $migrationsBackup) {
        Rename-Item -Path $migrationsBackup -NewName "migrations" -Force
    }
    exit 1
}
finally {
    # Restaurar el directorio de migraciones
    if (Test-Path $migrationsBackup) {
        Write-Host "   → Restaurando directorio de migraciones..." -ForegroundColor Gray
        Rename-Item -Path $migrationsBackup -NewName "migrations" -Force
    }
}

# Mostrar URLs
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " [OK] SISTEMA INICIADO EN MODO LIMPIO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "SUPABASE (Base de datos LIMPIA):" -ForegroundColor Cyan
Write-Host "   Studio:     http://localhost:54323" -ForegroundColor White
Write-Host "   PostgreSQL: postgresql://postgres:postgres@localhost:54322/postgres" -ForegroundColor White
Write-Host "   PostgREST:  http://localhost:54321/rest/v1" -ForegroundColor White
Write-Host ""
Write-Host "API GATEWAY (Kong):" -ForegroundColor Cyan
Write-Host "   Proxy:      http://localhost:8000" -ForegroundColor White
Write-Host "   Admin:      http://localhost:8001" -ForegroundColor White
Write-Host ""
Write-Host "EVENT BUS:" -ForegroundColor Cyan
Write-Host "   RabbitMQ:   http://localhost:15672 (user: alito)" -ForegroundColor White
Write-Host ""
Write-Host "OBSERVABILIDAD:" -ForegroundColor Cyan
Write-Host "   Prometheus: http://localhost:9090" -ForegroundColor White
Write-Host "   Grafana:    http://localhost:3001 (user: admin)" -ForegroundColor White
Write-Host "   Jaeger:     http://localhost:16686" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "IMPORTANTE: MIGRACIONES NO APLICADAS" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Para aplicar migraciones manualmente:" -ForegroundColor Cyan
Write-Host "   supabase db reset" -ForegroundColor White
Write-Host ""
Write-Host "Para detener todo:" -ForegroundColor Cyan
Write-Host "   .\scripts\stop.ps1" -ForegroundColor White
Write-Host ""
