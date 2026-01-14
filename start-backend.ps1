# Script para arrancar los servicios de Backend en ventanas separadas (o en segundo plano)
$nodePath = "C:\Program Files\nodejs\node.exe"
$nestBin = "node_modules\.bin\nest.cmd"

$services = @(
    "master-data-service",
    "quotation-service",
    "billing-service",
    "ar-service",
    "notification-service",
    "audit-service",
    "proforma-service"
)

# El identity-service es especial porque lo necesitamos para el login
Write-Host "Iniciando Identity Service..."
cd "sistema_facturacion\services\identity-service"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run start:dev" -WindowStyle Normal
cd ..\..\..

foreach ($service in $services) {
    Write-Host "Iniciando $service..."
    cd "sistema_facturacion\services\$service"
    Start-Process powershell -ArgumentList "-Command", "npm run start:dev" -WindowStyle Minimized
    cd ..\..\..
}

Write-Host "Todos los servicios han sido lanzados."
