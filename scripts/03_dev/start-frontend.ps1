# Script para arrancar el Frontend (UI principal)
# Nota: `sistema_facturacion/web-app` corre con Vite.

Write-Host "Iniciando Frontend (web-app)" -ForegroundColor Cyan

# Detectar Node/NPM
try {
    $nodeCmd = Get-Command node -ErrorAction Stop
    $npmCmd = Get-Command npm -ErrorAction Stop
}
catch {
    Write-Error "CRÍTICO: No se encontró Node.js/NPM en el PATH. Ejecuta primero los scripts de FIX_PATH*.ps1 o reinstala Node.js."
    exit 1
}

$nodeDir = Split-Path -Parent $nodeCmd.Source
$env:PATH = "$nodeDir;$env:PATH"

$webAppPath = Join-Path $PSScriptRoot "sistema_facturacion\web-app"
if (-not (Test-Path $webAppPath)) {
    Write-Error "No se encontró la carpeta web-app en: $webAppPath"
    exit 1
}

Set-Location $webAppPath

# Instalar dependencias si no existen
if (-not (Test-Path (Join-Path $webAppPath "node_modules"))) {
    Write-Host "node_modules no encontrado. Instalando dependencias de web-app..." -ForegroundColor Yellow
    npm install
}

Write-Host "Frontend listo. Iniciando Vite dev server..." -ForegroundColor Green
npm run dev
