# Script para corregir el PATH de Node.js en esta sesión de PowerShell
Write-Host "🔧 Corrigiendo PATH de Node.js..." -ForegroundColor Cyan

# Agregar Node.js correcto al PATH de esta sesión
$env:PATH = "C:\Program Files\nodejs;$env:PATH"

# Verificar
Write-Host "`n✅ Verificando instalación..." -ForegroundColor Green
node --version
npm --version

Write-Host "`n✅ PATH corregido para esta sesión de PowerShell" -ForegroundColor Green
Write-Host "Para corrección permanente, ejecuta: fix-node-path-permanent.ps1" -ForegroundColor Yellow
