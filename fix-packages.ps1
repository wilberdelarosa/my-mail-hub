# Script para arreglar package.json en todos los servicios (Nest 10 + bcryptjs)
$servicesDir = "c:\Users\wilbe\Downloads\TESISFACTURACION\sistema_facturacion\services"

Get-ChildItem -Path $servicesDir -Directory | ForEach-Object {
    $pkgPath = "$($_.FullName)\package.json"
    if (Test-Path $pkgPath) {
        Write-Host "Arreglando: $($_.Name)" -ForegroundColor Yellow
        $json = Get-Content $pkgPath | ConvertFrom-Json
        
        # Downgrade a Nest 10 para mejor compatibilidad
        $json.dependencies.'@nestjs/common' = "^10.4.15"
        $json.dependencies.'@nestjs/core' = "^10.4.15"
        $json.dependencies.'@nestjs/platform-express' = "^10.4.15"
        $json.dependencies.'@nestjs/config' = "^3.3.0"
        $json.dependencies.'@nestjs/jwt' = "^10.2.0"
        $json.dependencies.'@nestjs/swagger' = "^7.4.2"
        $json.dependencies.'@nestjs/microservices' = "^10.4.15"
        
        # Cambiar bcrypt por bcryptjs (sin dependencias nativas)
        if ($json.dependencies.bcrypt) {
            $json.dependencies.PSObject.Properties.Remove('bcrypt')
            $json.dependencies | Add-Member -MemberType NoteProperty -Name "bcryptjs" -Value "^2.4.3"
        }
        
        if ($json.devDependencies.'@types/bcrypt') {
            $json.devDependencies.PSObject.Properties.Remove('@types/bcrypt')
            $json.devDependencies | Add-Member -MemberType NoteProperty -Name "@types/bcryptjs" -Value "^2.4.6"
        }
        
        # Update devDeps de Nest
        $json.devDependencies.'@nestjs/cli' = "^10.4.9"
        $json.devDependencies.'@nestjs/schematics' = "^10.2.3"
        $json.devDependencies.'@nestjs/testing' = "^10.4.15"

        $json | ConvertTo-Json -Depth 10 | Out-File $pkgPath -Encoding utf8
    }
}

Write-Host "¡Package.json corregidos!" -ForegroundColor Green
