# Script de Instalación ULTRA ROBUSTO
# ALITO GROUP - Versión 3.0

$nodeDir = "C:\Program Files\nodejs"
$nodeExe = "$nodeDir\node.exe"
$npmCli = "$nodeDir\node_modules\npm\bin\npm-cli.js"

# Forzamos Node en el PATH del proceso actual para que npm funcione internamente
$env:PATH = "$nodeDir;" + $env:PATH

$servicesDir = "c:\Users\wilbe\Downloads\TESISFACTURACION\sistema_facturacion\services"
$webAppDir = "c:\Users\wilbe\Downloads\TESISFACTURACION\sistema_facturacion\web-app"

function Install-Deps($path) {
    if (Test-Path "$path\package.json") {
        Write-Host "`n>>> PROCESANDO: $path <<<" -ForegroundColor Cyan
        Set-Location $path
        
        # Eliminamos package-lock anterior si existe para evitar conflictos de versiones
        if (Test-Path "package-lock.json") { Remove-Item "package-lock.json" -Force }
        
        Write-Host "Ejecutando npm install..." -ForegroundColor Gray
        & $nodeExe $npmCli install --legacy-peer-deps
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "EXITO: Dependencias instaladas en $($path.Split('\')[-1])" -ForegroundColor Green
        }
        else {
            Write-Host "ERROR: Falló la instalación en $($path.Split('\')[-1])" -ForegroundColor Red
        }
    }
}

# 1. Frontend
Install-Deps $webAppDir

# 2. Servicios
$services = Get-ChildItem -Path $servicesDir -Directory
foreach ($service in $services) {
    Install-Deps $service.FullName
}

Write-Host "`n¡PROCESO FINALIZADO!" -ForegroundColor Green
Set-Location "c:\Users\wilbe\Downloads\TESISFACTURACION"
