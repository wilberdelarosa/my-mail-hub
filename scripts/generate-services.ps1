#!/usr/bin/env pwsh
# Script para crear scaffolding de múltiples microservicios
# Genera estructura hexagonal básica para cada servicio

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Generando Microservicios" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$services = @(
    @{
        Name        = "master-data-service"
        Port        = 3002
        Description = "Master Data - Clientes, Servicios, Precios"
    },
    @{
        Name        = "quotation-service"
        Port        = 3003
        Description = "Quotation - Gestión de Cotizaciones"
    },
    @{
        Name        = "billing-service"
        Port        = 3004
        Description = "Billing - Facturación y e-NCF"
    },
    @{
        Name        = "ar-service"
        Port        = 3005
        Description = "Accounts Receivable - Cuentas por Cobrar"
    }
)

$basePath = "sistema_facturacion\services"

foreach ($service in $services) {
    $servicePath = "$basePath\$($service.Name)"
    
    Write-Host "Creando $($service.Name)..." -ForegroundColor Yellow
    
    # Crear estructura de carpetas
    $folders = @(
        "$servicePath\src\domain\entities",
        "$servicePath\src\domain\value-objects",
        "$servicePath\src\domain\ports\inbound",
        "$servicePath\src\domain\ports\outbound",
        "$servicePath\src\application\use-cases",
        "$servicePath\src\adapters\inbound\http",
        "$servicePath\src\adapters\outbound\persistence",
        "$servicePath\src\adapters\outbound\events",
        "$servicePath\src\infrastructure\config",
        "$servicePath\src\infrastructure\modules"
    )
    
    foreach ($folder in $folders) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
    }
    
    Write-Host "   [OK] Estructura de carpetas creada" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " [OK] 4 Microservicios Generados" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
