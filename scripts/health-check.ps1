#!/usr/bin/env pwsh
# Script de verificacion de salud - Sistema de Facturacion
# Ejecutar: .\health-check.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Health Check - Sistema de Facturacion" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$global:allHealthy = $true

function Test-Service {
    param(
        [string]$Name,
        [string]$Url,
        [int[]]$AcceptedStatusCodes = @(200)
    )
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Get -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        if ($AcceptedStatusCodes -contains $response.StatusCode) {
            Write-Host "   [OK] $Name" -ForegroundColor Green
            return $true
        }
    }
    catch {
        # Kong sin rutas devuelve 404, pero está funcionando
        if ($_.Exception.Response.StatusCode.value__ -in $AcceptedStatusCodes) {
            Write-Host "   [OK] $Name" -ForegroundColor Green
            return $true
        }
        Write-Host "   [FAIL] $Name (No responde)" -ForegroundColor Red
        Write-Host "          URL: $Url" -ForegroundColor Gray
        $global:allHealthy = $false
        return $false
    }
}

# Supabase
Write-Host ""
Write-Host "[SUPABASE]" -ForegroundColor Cyan
$null = Test-Service "PostgREST API" "http://localhost:54321" -AcceptedStatusCodes @(200, 404)
$null = Test-Service "Supabase Studio" "http://localhost:54323"

# Kong
Write-Host ""
Write-Host "[API GATEWAY]" -ForegroundColor Cyan
$null = Test-Service "Kong Proxy" "http://localhost:8000" -AcceptedStatusCodes @(200, 404)
Write-Host "   [INFO] Kong Admin API deshabilitada (modo declarativo)" -ForegroundColor Gray

# RabbitMQ
Write-Host ""
Write-Host "[EVENT BUS]" -ForegroundColor Cyan
$null = Test-Service "RabbitMQ Management" "http://localhost:15672"

# Observabilidad
Write-Host ""
Write-Host "[OBSERVABILITY]" -ForegroundColor Cyan
$null = Test-Service "Prometheus" "http://localhost:9090"
$null = Test-Service "Grafana" "http://localhost:3001"
$null = Test-Service "Jaeger" "http://localhost:17686"

# Resultado final
Write-Host ""
if ($global:allHealthy) {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host " [OK] TODOS LOS SERVICIOS SALUDABLES" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
}
else {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host " [ERROR] ALGUNOS SERVICIOS NO RESPONDEN" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Intenta reiniciar: .\stop.ps1 y luego .\start.ps1" -ForegroundColor Yellow
}

Write-Host ""
