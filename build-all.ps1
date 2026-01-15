# Build All Services Script
Write-Host "Building all services..." -ForegroundColor Cyan
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH

$basePath = "c:\Users\wilbe\Downloads\TESISFACTURACION\sistema_facturacion\services"

$services = @(
    "identity-service",
    "master-data-service",
    "quotation-service",
    "billing-service",
    "ar-service",
    "documents-service"
)

$results = @()

foreach ($svc in $services) {
    $path = Join-Path $basePath $svc
    if (Test-Path $path) {
        Write-Host "Building $svc..." -ForegroundColor Yellow
        Push-Location $path
        
        npm run build 2>&1 | Out-Null
        $success = $LASTEXITCODE -eq 0
        
        $results += @{Service = $svc; Success = $success }
        
        if ($success) {
            Write-Host "  OK - $svc" -ForegroundColor Green
        }
        else {
            Write-Host "  ERROR - $svc" -ForegroundColor Red
        }
        
        Pop-Location
    }
}

Write-Host "`nSummary:" -ForegroundColor Cyan
$successCount = ($results | Where-Object { $_.Success }).Count
$totalCount = $results.Count
Write-Host "Success: $successCount/$totalCount services" -ForegroundColor Green
