# Script auxiliar para inicializar Supabase en `sistema_facturacion/supabase`
# Requiere Supabase CLI instalado y Docker Desktop corriendo.

Set-Location -Path "$PSScriptRoot\..\sistema_facturacion\supabase"
if (-not (Test-Path '.supabase')) {
    Write-Host "Inicializando supabase (supabase init)"
    supabase init
} else {
    Write-Host "Supabase ya inicializado."
}

Write-Host "Iniciando Supabase local (supabase start). Sigue las instrucciones en la terminal."
supabase start
