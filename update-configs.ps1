# Configuración Global de Microservicios para ALITO GROUP

$commonOrigins = "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://192.168.137.1:3000,http://192.168.137.1:3002"

# 1. Identity Service (Port 3001)
Write-Host "Configurando Identity Service..."
$idEnv = @"
PORT=3001
NODE_ENV=development
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_KEY=sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
JWT_SECRET=alito-secret-key-2026
JWT_EXPIRATION=1h
RABBITMQ_URL=amqp://alito:alito_dev_2026@localhost:5672
CORS_ORIGIN=$commonOrigins
"@
$idEnv | Out-File -FilePath "sistema_facturacion\services\identity-service\.env" -Encoding utf8

# 2. Master Data Service (Port 3002)
Write-Host "Configurando Master Data Service..."
$mdEnv = @"
PORT=3002
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_KEY=sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
RABBITMQ_URL=amqp://alito:alito_dev_2026@localhost:5672
CORS_ORIGIN=$commonOrigins
"@
$mdEnv | Out-File -FilePath "sistema_facturacion\services\master-data-service\.env" -Encoding utf8

# 3. Quotation Service (Port 3003)
Write-Host "Configurando Quotation Service..."
$qEnv = @"
PORT=3003
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_KEY=sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
RABBITMQ_URL=amqp://alito:alito_dev_2026@localhost:5672
CORS_ORIGIN=$commonOrigins
"@
$qEnv | Out-File -FilePath "sistema_facturacion\services\quotation-service\.env" -Encoding utf8

# 4. Billing Service (Port 3004)
Write-Host "Configurando Billing Service..."
$bEnv = @"
PORT=3004
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_KEY=sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
RABBITMQ_URL=amqp://alito:alito_dev_2026@localhost:5672
CORS_ORIGIN=$commonOrigins
"@
$bEnv | Out-File -FilePath "sistema_facturacion\services\billing-service\.env" -Encoding utf8

# 5. AR Service (Port 3005)
Write-Host "Configurando AR Service..."
$arEnv = @"
PORT=3005
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_KEY=sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
RABBITMQ_URL=amqp://alito:alito_dev_2026@localhost:5672
CORS_ORIGIN=$commonOrigins
"@
$arEnv | Out-File -FilePath "sistema_facturacion\services\ar-service\.env" -Encoding utf8

Write-Host "Todos los archivos .env han sido actualizados."
