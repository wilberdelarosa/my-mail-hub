#!/usr/bin/env pwsh
# Script de inicio para Sistema de Facturación - ALITO GROUP
# Ejecutar: .\start.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Sistema de Facturación Cloud" -ForegroundColor Cyan
Write-Host " ALITO GROUP SRL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Docker
Write-Host "1. Verificando Docker Desktop..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "   ✅ Docker Desktop está corriendo" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Docker Desktop NO está corriendo" -ForegroundColor Red
    Write-Host "   Por favor, inicia Docker Desktop y ejecuta este script nuevamente" -ForegroundColor Red
    exit 1
}

# Verificar Supabase CLI
Write-Host ""
Write-Host "2. Verificando Supabase CLI..." -ForegroundColor Yellow
try {
    $supabaseVersion = supabase --version 2>&1
    Write-Host "   ✅ Supabase CLI instalado: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Supabase CLI no encontrado" -ForegroundColor Red
    Write-Host "   Instalar: https://supabase.com/docs/guides/cli" -ForegroundColor Yellow
    exit 1
}

# Crear .env si no existe
if (!(Test-Path "sistema_facturacion/.env")) {
    Write-Host ""
    Write-Host "3. Creando archivo .env..." -ForegroundColor Yellow
    Copy-Item "sistema_facturacion/.env.example" "sistema_facturacion/.env"
    Write-Host "   ✅ .env creado desde .env.example" -ForegroundColor Green
    Write-Host "   📝 Edita sistema_facturacion/.env con tus credenciales" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "3. Archivo .env existe" -ForegroundColor Green
}

# Iniciar Supabase (desde raíz)
Write-Host ""
Write-Host "4. Iniciando Supabase Local..." -ForegroundColor Yellow
Write-Host "   Esto puede tomar 1-2 minutos..." -ForegroundColor Gray

try {
    supabase start
    Write-Host "   ✅ Supabase iniciado exitosamente" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error al iniciar Supabase" -ForegroundColor Red
    Write-Host "   Mensaje: $_" -ForegroundColor Red
    exit 1
}

# Iniciar servicios complementarios
Write-Host ""
Write-Host "5. Iniciando servicios complementarios (Docker Compose)..." -ForegroundColor Yellow
Set-Location sistema_facturacion

try {
    docker-compose up -d
    Write-Host "   ✅ Servicios iniciados exitosamente" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error al iniciar servicios" -ForegroundColor Red
    Write-Host "   Mensaje: $_" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Set-Location ..

# Mostrar URLs
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " ✅ TODOS LOS SERVICIOS INICIADOS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📊 SUPABASE:" -ForegroundColor Cyan
Write-Host "   Studio:     http://localhost:54323" -ForegroundColor White
Write-Host "   PostgreSQL: postgresql://postgres:postgres@localhost:54322/postgres" -ForegroundColor White
Write-Host "   PostgREST:  http://localhost:54321/rest/v1" -ForegroundColor White
Write-Host ""
Write-Host "🚪 API GATEWAY (Kong):" -ForegroundColor Cyan
Write-Host "   Proxy:      http://localhost:8000" -ForegroundColor White
Write-Host "   Admin:      http://localhost:8001" -ForegroundColor White
Write-Host ""
Write-Host "💬 EVENT BUS:" -ForegroundColor Cyan
Write-Host "   RabbitMQ:   http://localhost:15672 (user: alito)" -ForegroundColor White
Write-Host ""
Write-Host "📈 OBSERVABILIDAD:" -ForegroundColor Cyan
Write-Host "   Prometheus: http://localhost:9090" -ForegroundColor White
Write-Host "   Grafana:    http://localhost:3001 (user: admin)" -ForegroundColor White
Write-Host "   Jaeger:     http://localhost:16686" -ForegroundColor White
Write-Host ""
Write-Host "Para detener todo: .\stop.ps1" -ForegroundColor Yellow
Write-Host ""
