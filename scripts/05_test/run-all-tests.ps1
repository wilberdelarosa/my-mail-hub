#!/usr/bin/env pwsh

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RUNNING ALL TESTS - ALITO GROUP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$services = @(
    "identity-service",
    "master-data-service",
    "quotation-service",
    "billing-service",
    "ar-service",
    "documents-service",
    "analytics-service",
    "offline-sync-service"
)

$totalPassed = 0
$totalFailed = 0

foreach ($service in $services) {
    Write-Host "🧪 Testing $service..." -ForegroundColor Yellow
    
    Push-Location "sistema_facturacion/services/$service"
    
    # Run tests
    $output = npm test 2>&1
    $exitCode = $LASTEXITCODE
    
    if ($exitCode -eq 0) {
        Write-Host "  ✅ $service tests PASSED" -ForegroundColor Green
        $totalPassed++
    }
    else {
        Write-Host "  ❌ $service tests FAILED" -ForegroundColor Red
        $totalFailed++
    }
    
    Pop-Location
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Passed: $totalPassed" -ForegroundColor Green
Write-Host "❌ Failed: $totalFailed" -ForegroundColor Red
Write-Host ""

if ($totalFailed -eq 0) {
    Write-Host "🎉 ALL TESTS PASSED!" -ForegroundColor Green
    exit 0
}
else {
    Write-Host "⚠️ SOME TESTS FAILED" -ForegroundColor Yellow
    exit 1
}
