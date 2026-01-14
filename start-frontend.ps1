# Script para arrancar el Frontend buscando Node.js explícitamente

$possiblePaths = @(
    "C:\Program Files\nodejs\node.exe",
    "C:\Program Files (x86)\nodejs\node.exe",
    "$env:APPDATA\nvm\v*\node.exe"
)

$nodePath = ""

# 1. Intentar encontrar Node en el PATH
try {
    $pathNode = Get-Command node -ErrorAction Stop
    $nodePath = $pathNode.Source
    Write-Host "Node encontrado en PATH: $nodePath"
}
catch {
    Write-Host "Node no encontrado en PATH. Buscando en rutas estándar..."
}

# 2. Si no está en Path, buscar en carpetas
if ([string]::IsNullOrEmpty($nodePath)) {
    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            $nodePath = $path
            Write-Host "Node encontrado en: $nodePath"
            break
        }
    }
}

if ([string]::IsNullOrEmpty($nodePath)) {
    Write-Error "CRÍTICO: No se pudo encontrar node.exe. Por favor instala Node.js o agrégalo a tu PATH."
    exit 1
}

# 3. Ejecutar Next.js usando el node encontrado
Write-Host "Iniciando Frontend con: $nodePath"
Set-Location "sistema_facturacion\web-app"

# Ejecutamos el binario de next directamente para evitar pasar por npm si es posible, 
# o llamamos a npm run dev pasando el path de node explícito si podemos.
# La forma más segura es invocar node_modules/next/dist/bin/next

$nextBin = "node_modules\next\dist\bin\next"

if (Test-Path $nextBin) {
    & $nodePath $nextBin "dev"
}
else {
    Write-Host "No se encontró el binario local de Next.js. Ejecutando instalación..."
    # Intentar npm install con el node encontrado
    $npmCli = "$($nodePath | Split-Path)\node_modules\npm\bin\npm-cli.js"
    if (-not (Test-Path $npmCli)) {
        # Fallback a buscar npm global
        $npmCli = "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js"
    }
    
    & $nodePath $npmCli "install"
    & $nodePath $nextBin "dev"
}
