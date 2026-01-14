#!/usr/bin/env pwsh
# Script de configuración de RabbitMQ
# Ejecutar: .\configure-rabbitmq.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Configuracion de RabbitMQ" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$rabbitHost = "localhost"
$rabbitPort = 15672
$rabbitUser = "alito"
$rabbitPass = "alito_dev_2026"

# Crear credencial
$pair = "${rabbitUser}:${rabbitPass}"
$encodedCreds = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($pair))
$headers = @{
    Authorization  = "Basic $encodedCreds"
    "Content-Type" = "application/json"
}

$baseUrl = "http://${rabbitHost}:${rabbitPort}/api"

Write-Host "1. Creando Exchanges..." -ForegroundColor Yellow

# Exchange: identity.events
$identityExchange = @{
    type        = "topic"
    durable     = $true
    auto_delete = $false
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/exchanges/%2F/identity.events" `
        -Method Put `
        -Headers $headers `
        -Body $identityExchange
    Write-Host "   [OK] Exchange 'identity.events' creado" -ForegroundColor Green
}
catch {
    Write-Host "   [INFO] Exchange 'identity.events' ya existe" -ForegroundColor Gray
}

# Exchange: quotation.events
$quotationExchange = @{
    type        = "topic"
    durable     = $true
    auto_delete = $false
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/exchanges/%2F/quotation.events" `
        -Method Put `
        -Headers $headers `
        -Body $quotationExchange
    Write-Host "   [OK] Exchange 'quotation.events' creado" -ForegroundColor Green
}
catch {
    Write-Host "   [INFO] Exchange 'quotation.events' ya existe" -ForegroundColor Gray
}

# Exchange: billing.events
$billingExchange = @{
    type        = "topic"
    durable     = $true
    auto_delete = $false
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/exchanges/%2F/billing.events" `
        -Method Put `
        -Headers $headers `
        -Body $billingExchange
    Write-Host "   [OK] Exchange 'billing.events' creado" -ForegroundColor Green
}
catch {
    Write-Host "   [INFO] Exchange 'billing.events' ya existe" -ForegroundColor Gray
}

Write-Host ""
Write-Host "2. Creando Queues..." -ForegroundColor Yellow

# Queue: identity_events
$identityQueue = @{
    durable     = $true
    auto_delete = $false
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/queues/%2F/identity_events" `
        -Method Put `
        -Headers $headers `
        -Body $identityQueue
    Write-Host "   [OK] Queue 'identity_events' creada" -ForegroundColor Green
}
catch {
    Write-Host "   [INFO] Queue 'identity_events' ya existe" -ForegroundColor Gray
}

# Queue: quotation_events
$quotationQueue = @{
    durable     = $true
    auto_delete = $false
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/queues/%2F/quotation_events" `
        -Method Put `
        -Headers $headers `
        -Body $quotationQueue
    Write-Host "   [OK] Queue 'quotation_events' creada" -ForegroundColor Green
}
catch {
    Write-Host "   [INFO] Queue 'quotation_events' ya existe" -ForegroundColor Gray
}

# Queue: billing_events
$billingQueue = @{
    durable     = $true
    auto_delete = $false
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/queues/%2F/billing_events" `
        -Method Put `
        -Headers $headers `
        -Body $billingQueue
    Write-Host "   [OK] Queue 'billing_events' creada" -ForegroundColor Green
}
catch {
    Write-Host "   [INFO] Queue 'billing_events' ya existe" -ForegroundColor Gray
}

Write-Host ""
Write-Host "3. Creando Bindings..." -ForegroundColor Yellow

# Binding: identity.events -> identity_events
$identityBinding = @{
    routing_key = "identity.#"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/bindings/%2F/e/identity.events/q/identity_events" `
        -Method Post `
        -Headers $headers `
        -Body $identityBinding
    Write-Host "   [OK] Binding 'identity.events' -> 'identity_events'" -ForegroundColor Green
}
catch {
    Write-Host "   [INFO] Binding ya existe" -ForegroundColor Gray
}

# Binding: quotation.events -> quotation_events
$quotationBinding = @{
    routing_key = "quotation.#"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/bindings/%2F/e/quotation.events/q/quotation_events" `
        -Method Post `
        -Headers $headers `
        -Body $quotationBinding
    Write-Host "   [OK] Binding 'quotation.events' -> 'quotation_events'" -ForegroundColor Green
}
catch {
    Write-Host "   [INFO] Binding ya existe" -ForegroundColor Gray
}

# Binding: billing.events -> billing_events
$billingBinding = @{
    routing_key = "billing.#"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/bindings/%2F/e/billing.events/q/billing_events" `
        -Method Post `
        -Headers $headers `
        -Body $billingBinding
    Write-Host "   [OK] Binding 'billing.events' -> 'billing_events'" -ForegroundColor Green
}
catch {
    Write-Host "   [INFO] Binding ya existe" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " [OK] RabbitMQ configurado exitosamente" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Exchanges creados:" -ForegroundColor Cyan
Write-Host "  - identity.events (topic)" -ForegroundColor White
Write-Host "  - quotation.events (topic)" -ForegroundColor White
Write-Host "  - billing.events (topic)" -ForegroundColor White
Write-Host ""
Write-Host "Queues creadas:" -ForegroundColor Cyan
Write-Host "  - identity_events" -ForegroundColor White
Write-Host "  - quotation_events" -ForegroundColor White
Write-Host "  - billing_events" -ForegroundColor White
Write-Host ""
Write-Host "Verificar: http://localhost:15672" -ForegroundColor Yellow
Write-Host ""
