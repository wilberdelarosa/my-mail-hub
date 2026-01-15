# Arquitectura de Producción - ALITO GROUP

## 🌐 Stack Completo en la Nube

```
┌─────────────────────────────────────────────────────────────────┐
│                         🌍 INTERNET                              │
│  👥 Usuarios  |  💬 WhatsApp  |  📧 Email  | <EOS_TOKEN>🤖 AI Services  │
└────────────┬────────────┬────────────┬──────────────┬───────────┘
             │            │            │              │
             │            │            │              │
┌────────────▼────────────▼────────────▼──────────────▼───────────┐
│                    🔒 CLOUDFLARE (CDN + DDoS)                    │
│              SSL/TLS · Caching · WAF · Rate Limiting             │
└────────────┬────────────┬────────────┬──────────────┬───────────┘
             │            │            │              │
             │            │            │              │
    ┌────────▼──────┐    │    ┌───────▼──────┐       │
    │               │    │    │              │       │
    │   VERCEL      │    │    │   n8n CLOUD  │       │
    │  (Frontend)   │    │    │ (Automation) │       │
    │               │    │    │              │       │
    │  ┌─────────┐  │    │    │  Workflows:  │       │
    │  │ Next.js │  │───┐│    │  · WhatsApp  │       │
    │  │  App    │  │   ││    │  · Email     │       │
    │  └─────────┘  │   ││    │  · AI Proc   │       │
    │               │   ││    └──────────────┘       │
    └───────────────┘   ││                           │
                        ││                           │
                    ┌───▼▼───────────────────────────▼──────┐
                    │                                        │
                    │        RAILWAY                         │
                    │      (Backend Services)                │
                    │                                        │
                    │  ┌──────────────────────────────────┐  │
                    │  │   Identity Service :3001        │  │
                    │  │   • JWT Auth                     │  │
                    │  │   • RBAC                         │  │
                    │  └──────────────────────────────────┘  │
                    │                                        │
                    │  ┌──────────────────────────────────┐  │
                    │  │   Master Data Service :3002      │  │
                    │  │   • Customers                    │  │
                    │  │   • Service Items                │  │
                    │  └──────────────────────────────────┘  │
                    │                                        │
                    │  ┌──────────────────────────────────┐  │
                    │  │   Quotation Service :3003        │  │
                    │  │   • Quotes & Proformas           │  │
                    │  │   • PDF Generation               │  │
                    │  └──────────────────────────────────┘  │
                    │                                        │
                    │  ┌──────────────────────────────────┐  │
                    │  │   Billing Service :3004          │  │
                    │  │   • NCF Management               │  │
                    │  │   • ITBIS Calculation            │  │
                    │  └──────────────────────────────────┘  │
                    │                                        │
                    │  ┌──────────────────────────────────┐  │
                    │  │   Documents Service :3008        │  │
                    │  │   • PDF Templates                │  │
                    │  │   • File Storage                 │  │
                    │  └──────────────────────────────────┘  │
                    │                                        │
                    └───┬────────────────┬───────────────────┘
                        │                │
                        │                │
            ┌───────────▼─────┐    ┌────▼─────────────┐
            │                 │    │                  │
            │  SUPABASE CLOUD │    │  CLOUDAMQP       │
            │  (Database)     │    │  (Message Queue) │
            │                 │    │                  │
            │  ┌───────────┐  │    │  ┌────────────┐  │
            │  │PostgreSQL │  │    │  │ RabbitMQ   │  │
            │  │   17.x    │  │    │  │  Managed   │  │
            │  └───────────┘  │    │  └────────────┘  │
            │                 │    │                  │
            │  ┌───────────┐  │    │  Exchanges:      │
            │  │  Storage  │  │    │  • quotation.*   │
            │  │   (PDFs)  │  │    │  • billing.*     │
            │  └───────────┘  │    │                  │
            │                 │    └──────────────────┘
            │  Point-in-Time  │
            │  Recovery (PITR)│
            │  Daily Backups  │
            └─────────────────┘


┌────────────────────────────────────────────────────────────────┐
│                    🔍 MONITORING & OBSERVABILITY                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  SENTRY                  UPTIME ROBOT           RAILWAY LOGS   │
│  (Error Tracking)        (Uptime Monitoring)   (Real-time)     │
│                                                                │
│  • Frontend Errors       • Endpoint Health     • Service Logs  │
│  • Backend Errors        • SSL Expiry          • Metrics       │
│  • Performance           • Response Times      • Traces        │
│                                                                │
└────────────────────────────────────────────────────────────────┘


🔐 SECURITY LAYERS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Cloudflare WAF (Web Application Firewall)
2. Rate Limiting (API throttling)
3. JWT Authentication (Bearer tokens)
4. RBAC (Role-Based Access Control)
5. Environment Variables (Secrets management)
6. SSL/TLS Encryption (End-to-end)
7. Database RLS (Row Level Security)
8. CORS Policies


💰 COST BREAKDOWN (Monthly):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌──────────────────┬─────────┬──────────────────────────┐
│ Service          │ Plan    │ Cost                     │
├──────────────────┼─────────┼──────────────────────────┤
│ Supabase         │ Pro     │ $25/mo                   │
│ Railway (5 svcs) │ Hobby   │ $25/mo ($5 × 5)          │
│ CloudAMQP        │ Free    │ $0/mo (1M msgs)          │
│ n8n Cloud        │ Starter │ $20/mo                   │
│ Vercel           │ Hobby   │ $0/mo                    │
│ Cloudflare       │ Free    │ $0/mo                    │
│ Sentry           │ Dev     │ $0/mo (5K errors)        │
│ UptimeRobot      │ Free    │ $0/mo                    │
├──────────────────┴─────────┼──────────────────────────┤
│ TOTAL                      │ ~$70/mo                  │
└────────────────────────────┴──────────────────────────┘


📊 SCALABILITY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Traffic Capacity:
  • Vercel: Unlimited requests
  • Railway: Up to 500K req/month (per service)
  • Supabase: 500GB transfer/month
  • RabbitMQ: 1M messages/month

Auto-Scaling:
  • Railway: Automatic horizontal scaling
  • Vercel: Serverless (infinite scale)
  • Supabase: Connection pooling (60 connections)


🔄 CI/CD PIPELINE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GitHub → (Push to main) → GitHub Actions
                             │
                    ┌────────┴────────┐
                    │                 │
              Build & Test      Deploy to Railway
                    │                 │
              Run Linting      Deploy to Vercel
                    │                 │
              Run Tests        Notify Slack
                    │                 │
                    └────────┬────────┘
                             │
                    ✅ Production Live


🌍 GLOBAL REACH:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cloudflare CDN: 300+ edge locations worldwide
Vercel Edge Network: Global distribution
Railway Region: US-East (fastest to Dominican Republic)
Supabase Region: US-East-1 (Virginia)

Latency from Dominican Republic:
  • Frontend (Vercel): ~20-40ms
  • Backend (Railway): ~50-80ms
  • Database (Supabase): ~60-90ms


📈 PERFORMANCE OPTIMIZATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Database Connection Pooling (PgBouncer)
2. Redis Caching Layer (future)
3. CDN for static assets
4. Lazy loading images
5. Code splitting (Next.js)
6. Gzip/Brotli compression
7. HTTP/2 Server Push


🔒 BACKUP & RECOVERY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Supabase:
  • Point-in-Time Recovery (PITR) - 7 days
  • Daily automatic backups
  • Manual snapshots available

Railway:
  • Git-based rollbacks
  • Instant rollback to previous deployment

RTO (Recovery Time Objective): < 15 minutes
RPO (Recovery Point Objective): < 1 hour
```

## 🚀 URLs de Producción

```
Frontend:     https://alito-facturacion.com
API Gateway:  https://api.alito-facturacion.com
n8n:          https://alito.app.n8n.cloud
Supabase:     https://YOUR_PROJECT.supabase.co
```

## 📞 Soporte 24/7

- **Email:** soporte@alitogroup.com
- **WhatsApp:** +1-809-XXX-XXXX
- **Status Page:** https://status.alito-facturacion.com
