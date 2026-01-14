# Mueve las carpetas de documentación que no son parte del root del proyecto
# Revisa este script antes de ejecutarlo.

$folders = @('anteproyecto','tesis','fases','prototipo')
$dest = Join-Path -Path $PSScriptRoot -ChildPath '..\archivos_no_proyecto'
$dest = (Resolve-Path $dest).ProviderPath

foreach ($f in $folders) {
    $src = Join-Path -Path $PSScriptRoot -ChildPath "..\$f"
    if (Test-Path $src) {
        Write-Host "Moviendo $src -> $dest\$f"
        Move-Item -Path $src -Destination $dest -Force -Verbose
    } else {
        Write-Host "No existe: $src"
    }
}

Write-Host "Movimiento finalizado. Verifique contenido en: $dest"