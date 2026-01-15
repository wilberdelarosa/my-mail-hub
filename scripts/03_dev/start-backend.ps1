# Script para iniciar todos los servicios backend
# Codificacion: UTF-8

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  INICIANDO SERVICIOS BACKEND" -ForegroundColor Cyan
Write-Host "  ALITO GROUP - Sistema Facturacion" -ForegroundColor Cyan  
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Detectar Node/NPM (importante porque Start-Job corre en otra sesión)
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

$services = @(
    @{Name = "Identity Service"; Path = "sistema_facturacion\services\identity-service"; Port = 3001 },
    @{Name = "Master Data Service"; Path = "sistema_facturacion\services\master-data-service"; Port = 3002 },
    @{Name = "Quotation Service"; Path = "sistema_facturacion\services\quotation-service"; Port = 3003 },
    @{Name = "Billing Service"; Path = "sistema_facturacion\services\billing-service"; Port = 3004 },
    @{Name = "AR Service"; Path = "sistema_facturacion\services\ar-service"; Port = 3005 },
    @{Name = "Documents Service"; Path = "sistema_facturacion\services\documents-service"; Port = 3008 },
    @{Name = "Analytics Service"; Path = "sistema_facturacion\services\analytics-service"; Port = 3010 },
    @{Name = "Offline Sync Service"; Path = "sistema_facturacion\services\offline-sync-service"; Port = 3011 }
)

$jobs = @()

foreach ($service in $services) {
    Write-Host "Iniciando $($service.Name)..." -ForegroundColor Yellow
    
    $job = Start-Job -ScriptBlock {
        param($path, $nodeDir)
        $env:PATH = "$nodeDir;$env:PATH"
        Set-Location $path
        npm run start:dev
    } -ArgumentList (Join-Path $PSScriptRoot $service.Path), $nodeDir
    
    $jobs += @{Job = $job; Name = $service.Name; Port = $service.Port }
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "Todos los servicios iniciados!" -ForegroundColor Green
Write-Host ""
Write-Host "Estado de los servicios:" -ForegroundColor Cyan

Start-Sleep -Seconds 5

foreach ($jobInfo in $jobs) {
    $state = $jobInfo.Job.State
    if ($state -eq "Running") { 
        Write-Host "  $($jobInfo.Name) : " -NoNewline
        Write-Host "Running" -ForegroundColor Green
        Write-Host "    http://localhost:$($jobInfo.Port)" -ForegroundColor Gray
    }
    else { 
        Write-Host "  $($jobInfo.Name) : " -NoNewline
        Write-Host $state -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Para ver los logs de un servicio especifico, usa:" -ForegroundColor Yellow
Write-Host "  Receive-Job -Id [ID] -Keep" -ForegroundColor Gray
Write-Host ""
Write-Host "Presiona Ctrl+C para detener todos los servicios" -ForegroundColor Yellow
Write-Host "Los servicios seguiran ejecutandose en segundo plano hasta que cierres esta ventana." -ForegroundColor Cyan
Write-Host ""

# Mantener el script corriendo
try {
    while ($true) {
        Start-Sleep -Seconds 60
        
        # Verificar que los jobs sigan corriendo
        foreach ($jobInfo in $jobs) {
            if ($jobInfo.Job.State -ne "Running") {
                Write-Host "ADVERTENCIA: $($jobInfo.Name) se detuvo!" -ForegroundColor Red
            }
        }
    }
}
finally {
    Write-Host ""
    Write-Host "Deteniendo servicios..." -ForegroundColor Yellow
    $jobs | ForEach-Object { Stop-Job $_.Job; Remove-Job $_.Job }
    Write-Host "Servicios detenidos." -ForegroundColor Green
}
