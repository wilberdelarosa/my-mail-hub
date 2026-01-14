param(
    [string]$OutputDir = "pdf",
    [string]$Image = "ghcr.io/mermaid-js/mermaid-cli:10.9.1"
)

$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$srcDir = (Resolve-Path $scriptDir).Path
$outPath = Join-Path $srcDir $OutputDir
if (-not (Test-Path $outPath)) { New-Item -ItemType Directory -Path $outPath | Out-Null }

# Require docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker no está disponible. Instala Docker Desktop o usa 'npx @mermaid-js/mermaid-cli' manualmente."
    exit 1
}

# Require docker daemon/engine
try {
    docker info *> $null
}
catch {
    Write-Error "Docker está instalado pero el engine/daemon no está activo. Abre Docker Desktop y espera a que esté 'Running', luego reintenta."
    exit 1
}

$files = Get-ChildItem -Path $srcDir -Filter *.mmd
if (-not $files) {
    Write-Warning "No se encontraron archivos .mmd en $srcDir"
    exit 0
}

foreach ($f in $files) {
    $name = $f.BaseName
    $inFile = "/data/$($f.Name)"
    $outFile = "/data/$OutputDir/$name.pdf"
    Write-Host "Render: $($f.Name) -> $OutputDir/$name.pdf"
    docker run --rm -v "${srcDir}:/data" "$Image" -i "$inFile" -o "$outFile" -b transparent
    if ($LASTEXITCODE -ne 0) {
        throw "Falló el render de '$($f.Name)'. Revisa Docker y vuelve a ejecutar."
    }
}

Write-Host "Listo. PDFs en $outPath"
