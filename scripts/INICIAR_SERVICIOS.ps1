#!/usr/bin/env pwsh
# INICIAR_SERVICIOS.ps1
# Script para iniciar servicios Docker

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Iniciando Servicios Docker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Docker
Write-Host "[1/4] Verificando Docker..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "      OK - Docker esta corriendo" -ForegroundColor Green
} catch {
    Write-Host "      ERROR - Docker NO esta corriendo" -ForegroundColor Red
    Write-Host "      Solucion: Abre Docker Desktop y espera 30 segundos" -ForegroundColor Yellow
    exit 1
}

# Crear .env si no existe
Write-Host ""
Write-Host "[2/4] Verificando configuracion..." -ForegroundColor Yellow
if (!(Test-Path "sistema_facturacion\.env")) {
    Copy-Item "sistema_facturacion\.env.example" "sistema_facturacion\.env"
    Write-Host "      OK - Archivo .env creado" -ForegroundColor Green
} else {
    Write-Host "      OK - Archivo .env existe" -ForegroundColor Green
}

# Iniciar servicios
Write-Host ""
Write-Host "[3/4] Iniciando servicios..." -ForegroundColor Yellow
Set-Location sistema_facturacion
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "      OK - Servicios iniciados" -ForegroundColor Green
} else {
    Write-Host "      ERROR - Fallo al iniciar servicios" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..

# Esperar a que servicios esten listos
Write-Host ""
Write-Host "[4/4] Esperando servicios..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Mostrar URLs
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " SERVICIOS INICIADOS CORRECTAMENTE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "[API GATEWAY - Kong]" -ForegroundColor Cyan
Write-Host "  Proxy:  http://localhost:8000" -ForegroundColor White
Write-Host "  Admin:  http://localhost:8001" -ForegroundColor White
Write-Host ""
Write-Host "[MESSAGE BROKER - RabbitMQ]" -ForegroundColor Cyan
Write-Host "  UI:     http://localhost:15672" -ForegroundColor White
Write-Host "  User:   alito / alito_dev_2026" -ForegroundColor Gray
Write-Host ""
Write-Host "[CACHE - Redis]" -ForegroundColor Cyan
Write-Host "  Puerto: localhost:6379" -ForegroundColor White
Write-Host ""
Write-Host "[OBSERVABILIDAD]" -ForegroundColor Cyan
Write-Host "  Prometheus: http://localhost:9090" -ForegroundColor White
Write-Host "  Grafana:    http://localhost:3001 (admin/admin)" -ForegroundColor White
Write-Host "  Jaeger:     http://localhost:17686" -ForegroundColor White
Write-Host ""

# Estado de contenedores
Write-Host "Estado de contenedores:" -ForegroundColor Cyan
docker ps
Write-Host ""
Write-Host "Para detener: cd sistema_facturacion; docker-compose down" -ForegroundColor Yellow
