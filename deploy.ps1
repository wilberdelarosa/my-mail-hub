# Script de Deployment Automatizado - ALITO GROUP
# Ejecutar: .\deploy.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DEPLOYMENT - Sistema Facturación" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar prerequisitos
Write-Host "📋 Verificando prerequisitos..." -ForegroundColor Yellow

$prerequisites = @{
    "git"      = "Git"
    "node"     = "Node.js"
    "npm"      = "npm"
    "supabase" = "Supabase CLI"
}

foreach ($cmd in $prerequisites.Keys) {
    if (Get-Command $cmd -ErrorAction SilentlyContinue) {
        Write-Host "  ✅ $($prerequisites[$cmd]) instalado" -ForegroundColor Green
    }
    else {
        Write-Host "  ❌ $($prerequisites[$cmd]) NO encontrado" -ForegroundColor Red
        Write-Host "     Instalar: https://docs.supabase.com/guides/cli" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""

# Paso 1: Configuración de variables
Write-Host "🔧 Paso 1: Configuración" -ForegroundColor Cyan
Write-Host ""

$SUPABASE_PROJECT_REF = Read-Host "Ingresa tu Supabase Project REF (ej: abcdefghijk)"
$SUPABASE_DB_PASSWORD = Read-Host "Ingresa tu Supabase Database Password" -AsSecureString
$RAILWAY_TOKEN = Read-Host "Ingresa tu Railway Token (opcional, presiona Enter para omitir)"

Write-Host ""

# Paso 2: Link Supabase
Write-Host "🗄️ Paso 2: Conectando a Supabase..." -ForegroundColor Cyan

supabase link --project-ref $SUPABASE_PROJECT_REF

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Conectado a Supabase" -ForegroundColor Green
}
else {
    Write-Host "  ❌ Error conectando a Supabase" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Paso 3: Aplicar migraciones
Write-Host "📊 Paso 3: Aplicando migraciones SQL..." -ForegroundColor Cyan

supabase db push

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Migraciones aplicadas" -ForegroundColor Green
}
else {
    Write-Host "  ⚠️ Revisar errores de migración" -ForegroundColor Yellow
}

Write-Host ""

# Paso 4: Build de servicios
Write-Host "🔨 Paso 4: Compilando servicios..." -ForegroundColor Cyan

$services = @(
    "identity-service",
    "master-data-service",
    "quotation-service",
    "billing-service",
    "documents-service"
)

foreach ($service in $services) {
    Write-Host "  Compilando $service..." -ForegroundColor Yellow
    
    Push-Location "sistema_facturacion/services/$service"
    
    npm install --production 2>&1 | Out-Null
    npm run build 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "    ✅ $service OK" -ForegroundColor Green
    }
    else {
        Write-Host "    ❌ $service FALLÓ" -ForegroundColor Red
    }
    
    Pop-Location
}

Write-Host ""

# Paso 5: Crear .env.production para cada servicio
Write-Host "🔐 Paso 5: Generando archivos .env.production..." -ForegroundColor Cyan

$SUPABASE_URL = "https://$SUPABASE_PROJECT_REF.supabase.co"

# Identity Service
@"
NODE_ENV=production
PORT=3001
SUPABASE_URL=$SUPABASE_URL
SUPABASE_SERVICE_KEY=YOUR_SERVICE_KEY_HERE
JWT_SECRET=alito_jwt_secret_min_32_chars_production_2026
JWT_EXPIRATION=7d
"@ | Out-File -FilePath "sistema_facturacion/services/identity-service/.env.production" -Encoding UTF8

Write-Host "  ✅ identity-service/.env.production" -ForegroundColor Green

# Master Data Service
@"
NODE_ENV=production
PORT=3002
SUPABASE_URL=$SUPABASE_URL
SUPABASE_SERVICE_KEY=YOUR_SERVICE_KEY_HERE
"@ | Out-File -FilePath "sistema_facturacion/services/master-data-service/.env.production" -Encoding UTF8

Write-Host "  ✅ master-data-service/.env.production" -ForegroundColor Green

# Quotation Service
@"
NODE_ENV=production
PORT=3003
SUPABASE_URL=$SUPABASE_URL
SUPABASE_SERVICE_KEY=YOUR_SERVICE_KEY_HERE
RABBITMQ_URL=amqps://YOUR_CLOUDAMQP_URL
DOCUMENTS_SERVICE_URL=https://documents-production.up.railway.app/api/documents/v1
"@ | Out-File -FilePath "sistema_facturacion/services/quotation-service/.env.production" -Encoding UTF8

Write-Host "  ✅ quotation-service/.env.production" -ForegroundColor Green

# Billing Service
@"
NODE_ENV=production
PORT=3004
SUPABASE_URL=$SUPABASE_URL
SUPABASE_SERVICE_KEY=YOUR_SERVICE_KEY_HERE
RABBITMQ_URL=amqps://YOUR_CLOUDAMQP_URL
"@ | Out-File -FilePath "sistema_facturacion/services/billing-service/.env.production" -Encoding UTF8

Write-Host "  ✅ billing-service/.env.production" -ForegroundColor Green

# Documents Service
@"
NODE_ENV=production
PORT=3008
SUPABASE_URL=$SUPABASE_URL
SUPABASE_SERVICE_KEY=YOUR_SERVICE_KEY_HERE
"@ | Out-File -FilePath "sistema_facturacion/services/documents-service/.env.production" -Encoding UTF8

Write-Host "  ✅ documents-service/.env.production" -ForegroundColor Green

Write-Host ""
Write-Host "⚠️ IMPORTANTE: Edita cada .env.production y reemplaza:" -ForegroundColor Yellow
Write-Host "   - YOUR_SERVICE_KEY_HERE (Supabase → Settings → API)" -ForegroundColor Yellow
Write-Host "   - YOUR_CLOUDAMQP_URL (CloudAMQP Dashboard)" -ForegroundColor Yellow
Write-Host ""

# Paso 6: Git setup (opcional)
Write-Host "📦 Paso 6: Configuración Git..." -ForegroundColor Cyan

$gitSetup = Read-Host "¿Quieres inicializar Git y hacer push? (s/n)"

if ($gitSetup -eq "s") {
    git init
    git add .
    git commit -m "Deploy: Sistema de Facturación ALITO GROUP"
    
    Write-Host ""
    Write-Host "📌 Próximo paso:" -ForegroundColor Cyan
    Write-Host "   1. Crea un repo en GitHub" -ForegroundColor White
    Write-Host "   2. Ejecuta:" -ForegroundColor White
    Write-Host "      git remote add origin https://github.com/TU_USUARIO/alito-facturacion.git" -ForegroundColor Gray
    Write-Host "      git push -u origin main" -ForegroundColor Gray
}

Write-Host ""

# Resumen
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ DEPLOYMENT PREPARADO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "   1. Editar archivos .env.production (agregar keys reales)" -ForegroundColor White
Write-Host "   2. Push a GitHub" -ForegroundColor White
Write-Host "   3. Conectar Railway con tu repo" -ForegroundColor White
Write-Host "   4. Deploy frontend en Vercel" -ForegroundColor White
Write-Host "   5. Configurar n8n Cloud" -ForegroundColor White
Write-Host ""
Write-Host "📖 Guía completa: docs/DEPLOYMENT_GUIDE.md" -ForegroundColor Yellow
Write-Host ""
