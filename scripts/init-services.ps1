# Script para inicializar package.json en todos los servicios nuevos
# Copia el de identity-service y ajusta el nombre

$services = @("master-data-service", "quotation-service", "billing-service", "ar-service")
$sourceJson = "sistema_facturacion\services\identity-service\package.json"

foreach ($service in $services) {
    $targetDir = "sistema_facturacion\services\$service"
    $targetJson = "$targetDir\package.json"

    if (Test-Path $targetDir) {
        Write-Host "Configuring $service..."
        
        # Copiar y reemplazar nombre
        $content = Get-Content $sourceJson -Raw
        $content = $content -replace '"name": "identity-service"', """name"": ""$service"""
        $content = $content -replace '"description": ".*?"', """description"": ""$service microservice"""
        
        Set-Content -Path $targetJson -Value $content
        Write-Host "Created package.json for $service"
        
        # Copiar tsconfig si hace falta
        Copy-Item "sistema_facturacion\services\identity-service\tsconfig.json" -Destination "$targetDir\tsconfig.json" -Force
        Copy-Item "sistema_facturacion\services\identity-service\tsconfig.build.json" -Destination "$targetDir\tsconfig.build.json" -Force
    }
}

Write-Host "All services initialized. Run 'npm install' in each directory."
