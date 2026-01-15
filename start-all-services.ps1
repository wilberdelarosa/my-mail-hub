# Script para iniciar TODOS los servicios del backend
# Corrige automáticamente el PATH de Node.js

Write-Host "🚀 Iniciando Sistema de Facturación - Backend Services" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Gray

# Corregir PATH de Node.js
$env:PATH = "C:\Program Files\nodejs;$env:PATH"

# Verificar Node.js
Write-Host "`n✅ Verificando Node.js..." -ForegroundColor Green
node --version
npm --version

$basePath = "c:\Users\wilbe\Downloads\TESISFACTURACION\sistema_facturacion\services"

# Servicios a iniciar
$services = @(
    @{Name = "Identity Service"; Path = "$basePath\identity-service"; Port = 3001 },
    @{Name = "Master Data Service"; Path = "$basePath\master-data-service"; Port = 3002 },
    @{Name = "Quotation Service"; Path = "$basePath\quotation-service"; Port = 3003 },
    @{Name = "Billing Service"; Path = "$basePath\billing-service"; Port = 3004 },
    @{Name = "AR Service"; Path = "$basePath\ar-service"; Port = 3005 },
    @{Name = "Documents Service"; Path = "$basePath\documents-service"; Port = 3008 },
    @{Name = "Audit Service"; Path = "$basePath\audit-service"; Port = 3009 },
    @{Name = "Offline Sync Service"; Path = "$basePath\offline-sync-service"; Port = 3010 }
)

Write-Host "`n📦 Servicios a iniciar:" -ForegroundColor Yellow
foreach ($svc in $services) {
    Write-Host "  • $($svc.Name) (Puerto: $($svc.Port))" -ForegroundColor White
}

Write-Host "`n⚠️  NOTA: Este script iniciará todos los servicios en segundo plano." -ForegroundColor Yellow
Write-Host "Para detenerlos, cierra esta ventana de PowerShell.`n" -ForegroundColor Yellow

$confirmation = Read-Host "¿Deseas continuar? (S/N)"
if ($confirmation -ne 'S' -and $confirmation -ne 's') {
    Write-Host "❌ Operación cancelada" -ForegroundColor Red
    exit
}

Write-Host "`n🔧 Instalando dependencias en todos los servicios..." -ForegroundColor Cyan
foreach ($svc in $services) {
    if (Test-Path $svc.Path) {
        Write-Host "`n  → $($svc.Name)..." -ForegroundColor Gray
        Push-Location $svc.Path
        npm install --silent 2>&1 | Out-Null
        Pop-Location
    }
}

Write-Host "`n✅ Dependencias instaladas`n" -ForegroundColor Green

Write-Host "🚀 Iniciando servicios..." -ForegroundColor Cyan
$jobs = @()

foreach ($svc in $services) {
    if (Test-Path $svc.Path) {
        Write-Host "  → Iniciando $($svc.Name)..." -ForegroundColor White
        
        $job = Start-Job -ScriptBlock {
            param($path, $name)
            $env:PATH = "C:\Program Files\nodejs;$env:PATH"
            Set-Location $path
            npm run start:dev
        } -ArgumentList $svc.Path, $svc.Name
        
        $jobs += @{Job = $job; Name = $svc.Name }
        Start-Sleep -Seconds 2
    }
    else {
        Write-Host "  ⚠️  $($svc.Name) no encontrado en $($svc.Path)" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ Todos los servicios iniciados!" -ForegroundColor Green
Write-Host "`n📊 Estado de los servicios:" -ForegroundColor Cyan

Start-Sleep -Seconds 5

foreach ($item in $jobs) {
    $status = $item.Job.State
    $color = if ($status -eq "Running") { "Green" } else { "Red" }
    Write-Host "  • $($item.Name): $status" -ForegroundColor $color
}

Write-Host "`n🔍 Para ver los logs de un servicio específico, usa:" -ForegroundColor Yellow
Write-Host "   Receive-Job -Id [ID] -Keep" -ForegroundColor Gray

Write-Host "`n⏸️  Presiona Ctrl+C para detener todos los servicios" -ForegroundColor Yellow
Write-Host "   Los servicios seguirán ejecutándose en segundo plano hasta que cierres esta ventana.`n" -ForegroundColor Gray

# Mantener el script corriendo y mostrando logs
try {
    while ($true) {
        Start-Sleep -Seconds 10
    }
}
finally {
    Write-Host "`n🛑 Deteniendo todos los servicios..." -ForegroundColor Red
    $jobs | ForEach-Object { Stop-Job $_.Job; Remove-Job $_.Job }
    Write-Host "✅ Servicios detenidos" -ForegroundColor Green
}
