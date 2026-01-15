#+#+#+#+################################################################################
# Script para iniciar TODO el sistema (Frontend + Microservicios)
# - Frontend: sistema_facturacion/web-app (Vite)
# - Backend: sistema_facturacion/services/*
################################################################################

Write-Host "Iniciando Sistema de Facturacion - ALITO GROUP (ALL)" -ForegroundColor Cyan
Write-Host ("=" * 70) -ForegroundColor Gray

# Detectar Node/NPM
try {
    $nodeCmd = Get-Command node -ErrorAction Stop
    $npmCmd = Get-Command npm -ErrorAction Stop
}
catch {
    Write-Error "CRÍTICO: No se encontró Node.js/NPM en el PATH. Ejecuta FIX_PATH*.ps1 o reinstala Node.js."
    exit 1
}

$nodeDir = Split-Path -Parent $nodeCmd.Source
$env:PATH = "$nodeDir;$env:PATH"

Write-Host "`nVerificando Node.js..." -ForegroundColor Green
node --version
npm --version

$repoRoot = $PSScriptRoot
$servicesBase = Join-Path $repoRoot "sistema_facturacion\services"
$webAppPath = Join-Path $repoRoot "sistema_facturacion\web-app"

# Servicios a iniciar (puertos consistentes con los servicios)
$services = @(
    @{Name = "Identity Service"; Path = (Join-Path $servicesBase "identity-service"); Port = 3001 },
    @{Name = "Master Data Service"; Path = (Join-Path $servicesBase "master-data-service"); Port = 3002 },
    @{Name = "Quotation Service"; Path = (Join-Path $servicesBase "quotation-service"); Port = 3003 },
    @{Name = "Billing Service"; Path = (Join-Path $servicesBase "billing-service"); Port = 3004 },
    @{Name = "AR Service"; Path = (Join-Path $servicesBase "ar-service"); Port = 3005 },
    @{Name = "Documents Service"; Path = (Join-Path $servicesBase "documents-service"); Port = 3008 },
    @{Name = "Audit Service"; Path = (Join-Path $servicesBase "audit-service"); Port = 3009 },
    @{Name = "Analytics Service"; Path = (Join-Path $servicesBase "analytics-service"); Port = 3010 },
    @{Name = "Offline Sync Service"; Path = (Join-Path $servicesBase "offline-sync-service"); Port = 3011 }
)

Write-Host "`nServicios a iniciar:" -ForegroundColor Yellow
foreach ($svc in $services) {
    Write-Host "  * $($svc.Name) (Puerto: $($svc.Port))" -ForegroundColor White
}

Write-Host "`nNOTA: Este script iniciara frontend + servicios en segundo plano." -ForegroundColor Yellow
Write-Host "Para detenerlos, cierra esta ventana de PowerShell.`n" -ForegroundColor Yellow

$confirmation = Read-Host "¿Deseas continuar? (S/N)"
if ($confirmation -ne 'S' -and $confirmation -ne 's') {
    Write-Host "❌ Operación cancelada" -ForegroundColor Red
    exit
}

Write-Host "`n¿Instalar dependencias antes de iniciar?" -ForegroundColor Yellow
$doInstall = Read-Host "Instalar npm install (S/N)" 
if ($doInstall -eq 'S' -or $doInstall -eq 's') {
    Write-Host "`nInstalando dependencias..." -ForegroundColor Cyan

    if (Test-Path $webAppPath) {
        Write-Host "`n  → Web App..." -ForegroundColor Gray
        Push-Location $webAppPath
        npm install
        Pop-Location
    }

    foreach ($svc in $services) {
        if (Test-Path $svc.Path) {
            Write-Host "`n  → $($svc.Name)..." -ForegroundColor Gray
            Push-Location $svc.Path
            npm install
            Pop-Location
        }
    }

    Write-Host "`nDependencias instaladas`n" -ForegroundColor Green
}

Write-Host "Iniciando Frontend + Servicios..." -ForegroundColor Cyan
$jobs = @()

# Frontend job
if (Test-Path $webAppPath) {
    Write-Host "  → Iniciando Frontend (web-app)..." -ForegroundColor White
    $feJob = Start-Job -ScriptBlock {
        param($path, $nodeDir)
        $env:PATH = "$nodeDir;$env:PATH"
        Set-Location $path
        npm run dev
    } -ArgumentList $webAppPath, $nodeDir
    $jobs += @{Job = $feJob; Name = "Frontend (web-app)" }
    Start-Sleep -Seconds 2
} else {
    Write-Host "  ⚠️  Frontend no encontrado en $webAppPath" -ForegroundColor Yellow
}

foreach ($svc in $services) {
    if (Test-Path $svc.Path) {
        Write-Host "  → Iniciando $($svc.Name)..." -ForegroundColor White
        
        $job = Start-Job -ScriptBlock {
            param($path, $nodeDir)
            $env:PATH = "$nodeDir;$env:PATH"
            Set-Location $path
            npm run start:dev
        } -ArgumentList $svc.Path, $nodeDir
        
        $jobs += @{Job = $job; Name = $svc.Name }
        Start-Sleep -Seconds 2
    }
    else {
        Write-Host "  ⚠️  $($svc.Name) no encontrado en $($svc.Path)" -ForegroundColor Yellow
    }
}

Write-Host "`nTodos los servicios iniciados!" -ForegroundColor Green
Write-Host "`nEstado de los servicios:" -ForegroundColor Cyan

Start-Sleep -Seconds 5

foreach ($item in $jobs) {
    $status = $item.Job.State
    $color = if ($status -eq "Running") { "Green" } else { "Red" }
    Write-Host "  * $($item.Name): $status" -ForegroundColor $color
}

Write-Host "`nPara ver los logs de un servicio especifico, usa:" -ForegroundColor Yellow
Write-Host "   Receive-Job -Id [ID] -Keep" -ForegroundColor Gray

Write-Host "`nURLs (por defecto):" -ForegroundColor Cyan
Write-Host "  * Frontend: http://localhost:3000" -ForegroundColor Gray
foreach ($svc in $services) {
    Write-Host "  * $($svc.Name): http://localhost:$($svc.Port)" -ForegroundColor Gray
}

Write-Host "`nPresiona Ctrl+C para detener todos los servicios" -ForegroundColor Yellow
Write-Host "   Los servicios seguiran ejecutandose en segundo plano hasta que cierres esta ventana.`n" -ForegroundColor Gray

# Mantener el script corriendo y mostrando logs
try {
    while ($true) {
        Start-Sleep -Seconds 10
    }
}
finally {
    Write-Host "`nDeteniendo todos los servicios..." -ForegroundColor Red
    $jobs | ForEach-Object { Stop-Job $_.Job; Remove-Job $_.Job }
    Write-Host "Servicios detenidos" -ForegroundColor Green
}
