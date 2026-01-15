# Auto-elevate to Administrator
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "Solicitando permisos de Administrador..." -ForegroundColor Yellow
    Start-Process powershell.exe "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    Exit
}

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "CORRIGIENDO PATH DE NODE.JS - PERMANENTE" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Obtener PATH actual del sistema
$currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")

# Remover rutas incorrectas de Node.js
Write-Host "Limpiando rutas antiguas de Node.js..." -ForegroundColor Yellow
$newPath = ($currentPath -split ';' | Where-Object { 
        $_ -notlike "*nodejs*" 
    }) -join ';'

# Agregar la ruta correcta
$nodePath = "C:\Program Files\nodejs"
Write-Host "Agregando ruta correcta: $nodePath" -ForegroundColor Yellow
$newPath = $nodePath + ";" + $newPath

try {
    # Actualizar PATH del sistema
    [Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
    
    Write-Host ""
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host "EXITO - PATH CORREGIDO PERMANENTEMENTE" -ForegroundColor Green
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Cambios realizados:" -ForegroundColor Cyan
    Write-Host "  - Removidas rutas antiguas de Node.js" -ForegroundColor White
    Write-Host "  - Agregada ruta: $nodePath" -ForegroundColor White
    Write-Host ""
    Write-Host "IMPORTANTE: CIERRA Y VUELVE A ABRIR:" -ForegroundColor Yellow
    Write-Host "  1. Esta ventana de PowerShell" -ForegroundColor White
    Write-Host "  2. Visual Studio Code" -ForegroundColor White
    Write-Host "  3. Cualquier otra terminal abierta" -ForegroundColor White
    Write-Host ""
    Write-Host "Despues de eso, 'node' y 'npm' funcionaran automaticamente." -ForegroundColor Green
    Write-Host ""
    
}
catch {
    Write-Host ""
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Write-Host "Presiona cualquier tecla para cerrar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
