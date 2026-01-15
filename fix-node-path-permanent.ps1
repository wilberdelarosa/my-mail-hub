# Script para CORREGIR PERMANENTEMENTE el PATH de Node.js
# IMPORTANTE: Ejecutar como Administrador

Write-Host "🔧 Corrigiendo PATH de Node.js (PERMANENTE)..." -ForegroundColor Cyan
Write-Host "⚠️  Esto requiere permisos de Administrador" -ForegroundColor Yellow

# Obtener PATH actual del sistema
$currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")

# Remover rutas incorrectas de Node.js
$newPath = ($currentPath -split ';' | Where-Object { 
        $_ -notlike "*nodejs*" 
    }) -join ';'

# Agregar la ruta correcta
$nodePath = "C:\Program Files\nodejs"
$newPath = "$nodePath;$newPath"

try {
    # Actualizar PATH del sistema
    [Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
    
    Write-Host "`n✅ PATH corregido permanentemente" -ForegroundColor Green
    Write-Host "⚠️  CIERRA Y VUELVE A ABRIR PowerShell para aplicar cambios" -ForegroundColor Yellow
    
    # Mostrar la nueva ruta
    Write-Host "`nNueva ruta de Node.js: $nodePath" -ForegroundColor Cyan
    
}
catch {
    Write-Host "`n❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Asegúrate de ejecutar PowerShell como Administrador" -ForegroundColor Yellow
}
