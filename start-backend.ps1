# Script para arrancar los servicios de Backend en ventanas separadas
# ALITO GROUP - Versión Optimizada

$services = @(
    "master-data-service",
    "quotation-service",
    "billing-service",
    "ar-service",
    "notification-service",
    "audit-service",
    "proforma-service",
    "offline-sync-service",
    "documents-service"
)

# El identity-service es especial porque lo necesitamos para el login
Write-Host "Iniciando Identity Service..." -ForegroundColor Cyan
Set-Location "sistema_facturacion\services\identity-service"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run start:dev" -WindowStyle Normal
Set-Location ..\..\..

foreach ($service in $services) {
    Write-Host "Iniciando $service..." -ForegroundColor Yellow
    Set-Location "sistema_facturacion\services\$service"
    Start-Process powershell -ArgumentList "-Command", "npm run start:dev" -WindowStyle Minimized
    Set-Location ..\..\..
}

Write-Host "`nTodos los servicios han sido lanzados." -ForegroundColor Green
