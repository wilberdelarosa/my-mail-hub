# Script rápido para compilar TODOS los servicios
# Útil para verificar que no hay errores

Write-Host "🔨 Compilando todos los servicios..." -ForegroundColor Cyan
$env:PATH = "C:\Program Files\nodejs;$env:PATH"

$basePath = "c:\Users\wilbe\Downloads\TESISFACTURACION\sistema_facturacion\services"

$services = @(
    "identity-service",
    "master-data-service",
    "quotation-service",
    "billing-service",
    "ar-service",
    "documents-service",
    "audit-service"
)

$results = @()

foreach ($svc in $services) {
    $path = Join-Path $basePath $svc
    if (Test-Path $path) {
        Write-Host "`n📦 Compilando $svc..." -ForegroundColor Yellow
        Push-Location $path
        
        $output = npm run build 2>&1
        $success = $LASTEXITCODE -eq 0
        
        $results += @{
            Service = $svc
            Success = $success
            Output  = $output
        }
        
        if ($success) {
            Write-Host "   ✅ $svc compilado correctamente" -ForegroundColor Green
        }
        else {
            Write-Host "   ❌ $svc falló la compilación" -ForegroundColor Red
        }
        
        Pop-Location
    }
}

Write-Host "`n" + ("=" * 70) -ForegroundColor Gray
Write-Host "📊 RESUMEN DE COMPILACIÓN" -ForegroundColor Cyan
Write-Host ("=" * 70) -ForegroundColor Gray

$successCount = ($results | Where-Object { $_.Success }).Count
$totalCount = $results.Count

foreach ($result in $results) {
    $status = if ($result.Success) { "✅ OK" } else { "❌ ERROR" }
    $color = if ($result.Success) { "Green" } else { "Red" }
    Write-Host "  $status - $($result.Service)" -ForegroundColor $color
}

Write-Host "`n✅ Éxito: $successCount/$totalCount servicios" -ForegroundColor $(if ($successCount -eq $totalCount) { "Green" } else { "Yellow" })

if ($successCount -lt $totalCount) {
    Write-Host "`n⚠️  Para ver detalles de los errores, ejecuta:" -ForegroundColor Yellow
    Write-Host "   cd [servicio-con-error]; npm run build" -ForegroundColor Gray
}
