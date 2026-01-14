#!/usr/bin/env pwsh
# Script de parada para Sistema de Facturación - ALITO GROUP
# Ejecutar: .\stop.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Deteniendo Servicios" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Detener servicios Docker Compose
Write-Host "1. Deteniendo servicios complementarios..." -ForegroundColor Yellow
Set-Location sistema_facturacion

try {
    docker-compose down
    Write-Host "   ✅ Servicios Docker detenidos" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Error al detener servicios Docker" -ForegroundColor Yellow
}

Set-Location ..

# Detener Supabase
Write-Host ""
Write-Host "2. Deteniendo Supabase Local..." -ForegroundColor Yellow

try {
    supabase stop
    Write-Host "   ✅ Supabase detenido" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Error al detener Supabase" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " ✅ SERVICIOS DETENIDOS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Para reiniciar: .\start.ps1" -ForegroundColor Yellow
Write-Host ""
