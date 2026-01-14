#!/usr/bin/env pwsh
# Script simplificado para iniciar todos los servicios
# REQUISITO: Docker Desktop debe estar corriendo primero

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Sistema de Facturación - ALITO GROUP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar Docker
Write-Host "1. Verificando Docker Desktop..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "   ✅ Docker está corriendo" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Docker NO está corriendo" -ForegroundColor Red
    Write-Host "" 
    Write-Host "   SOLUCIÓN:" -ForegroundColor Yellow
    Write-Host "   1. Busca 'Docker Desktop' en el menú inicio de Windows" -ForegroundColor White
    Write-Host "   2. Ábrelo y espera 30-60 segundos" -ForegroundColor White
    Write-Host "   3. Verifica que aparezca el ícono de la ballena en la bandeja del sistema" -ForegroundColor White
    Write-Host "   4. Vuelve a ejecutar este script" -ForegroundColor White
    Write-Host ""
    exit 1
}

# 2. Crear .env si no existe
Write-Host ""
Write-Host "2. Verificando configuración..." -ForegroundColor Yellow
if (!(Test-Path "sistema_facturacion\.env")) {
    Copy-Item "sistema_facturacion\.env.example" "sistema_facturacion\.env"
    Write-Host "   ✅ Archivo .env creado" -ForegroundColor Green
} else {
    Write-Host "   ✅ Archivo .env existe" -ForegroundColor Green
}

# 3. Iniciar servicios Docker Compose
Write-Host ""
Write-Host "3. Iniciando servicios..." -ForegroundColor Yellow
Set-Location sistema_facturacion

docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Servicios iniciados" -ForegroundColor Green
} else {
    Write-Host "   ❌ Error al iniciar servicios" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Set-Location ..

# 4. Mostrar URLs
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " ✅ SERVICIOS INICIADOS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "[API GATEWAY] Kong:" -ForegroundColor Cyan
Write-Host "   Proxy:      http://localhost:8000" -ForegroundColor White
Write-Host "   Admin:      http://localhost:8001" -ForegroundColor White
Write-Host ""
Write-Host "[MESSAGE BROKER] RabbitMQ:" -ForegroundColor Cyan
Write-Host "   UI:         http://localhost:15672" -ForegroundColor White
Write-Host "   Usuario:    alito" -ForegroundColor Gray
Write-Host "   Password:   alito_dev_2026" -ForegroundColor Gray
Write-Host ""
Write-Host "[CACHE] Redis:" -ForegroundColor Cyan
Write-Host "   Puerto:     localhost:6379" -ForegroundColor White
Write-Host ""
Write-Host "[OBSERVABILIDAD]:" -ForegroundColor Cyan
Write-Host "   Prometheus: http://localhost:9090" -ForegroundColor White
Write-Host "   Grafana:    http://localhost:3001" -ForegroundColor White
Write-Host "   Jaeger:     http://localhost:16686" -ForegroundColor White
Write-Host ""
Write-Host "Para detener: docker-compose down (dentro de sistema_facturacion)" -ForegroundColor Yellow
Write-Host ""

# Mostrar estado de contenedores
Write-Host "Estado de contenedores:" -ForegroundColor Cyan
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
