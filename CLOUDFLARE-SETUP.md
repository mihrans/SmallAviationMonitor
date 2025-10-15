# Cloudflare Deployment Guide

## Prerequisites

1. **Cloudflare Account**
   - Sign up at https://dash.cloudflare.com
   - Note your Account ID

2. **Install Wrangler CLI**
   ```bash
   npm install -g wrangler
   wrangler login
   ```

3. **GitHub Repository Secrets**
   Add these secrets to your GitHub repository:
   - `CLOUDFLARE_API_TOKEN`: Create at Cloudflare Dashboard → My Profile → API Tokens
   - `CLOUDFLARE_ACCOUNT_ID`: Found in Cloudflare Dashboard → Workers & Pages

## Setup Steps

### 1. Create Cloudflare D1 Database

```bash
cd backend
wrangler d1 create smallaviationmonitor-db
```

Copy the database ID and update `backend/wrangler.toml`:
```toml
database_id = "your-database-id-here"
```

Initialize the database schema:
```bash
wrangler d1 execute smallaviationmonitor-db --file=./schema/init.sql
```

### 2. Create Cloudflare Queue

```bash
wrangler queues create smallaviationmonitor-alerts
```

### 3. Create Cloudflare Pages Project

Via Dashboard:
1. Go to Workers & Pages → Create Application → Pages
2. Connect to GitHub repository
3. Set project name: `smallaviationmonitor`
4. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `frontend`

Or via Wrangler:
```bash
cd frontend
npm run build
wrangler pages deploy dist --project-name=smallaviationmonitor
```

### 4. Deploy Backend Workers

Update account ID in `backend/wrangler.toml`:
```toml
account_id = "your-account-id-here"
```

Deploy:
```bash
cd backend
npm install
wrangler deploy
```

### 5. Configure Custom Domain (Optional)

In Cloudflare Dashboard:
1. Workers & Pages → smallaviationmonitor → Custom Domains
2. Add your domain
3. Configure DNS automatically

## Environment Variables

### Frontend (Cloudflare Pages)
Set via Dashboard → Workers & Pages → smallaviationmonitor → Settings → Environment Variables

```
VITE_API_URL=https://api.smallaviationmonitor.com
VITE_WS_URL=wss://api.smallaviationmonitor.com/ws
```

### Backend (Workers)
Set via Dashboard or `wrangler.toml`:

```toml
[env.production.vars]
ENVIRONMENT = "production"
ALERT_EMAIL_FROM = "alerts@smallaviationmonitor.com"
```

## Deployment Workflow

### Automatic Deployment (GitHub Actions)

Push to branches triggers automatic deployment:

- **`main` branch** → Production deployment
  - Frontend: `smallaviationmonitor.com`
  - Backend: `api.smallaviationmonitor.com`

- **`staging` branch** → Staging deployment
  - Frontend: `staging.smallaviationmonitor.pages.dev`
  - Backend: `staging-api.smallaviationmonitor.com`

### Manual Deployment

Frontend:
```bash
cd frontend
npm run build
wrangler pages deploy dist --project-name=smallaviationmonitor
```

Backend:
```bash
cd backend
npm run deploy:production
# or
npm run deploy:staging
```

## Monitoring

### Cloudflare Dashboard
- Workers & Pages → smallaviationmonitor → Analytics
- View requests, errors, CPU usage

### Logs
```bash
# Tail worker logs
wrangler tail

# View Pages logs
wrangler pages deployment list --project-name=smallaviationmonitor
```

## Troubleshooting

### Database Connection Issues
Verify database binding in `wrangler.toml` and that migrations are applied:
```bash
wrangler d1 execute smallaviationmonitor-db --command="SELECT * FROM devices LIMIT 1"
```

### Queue Issues
Check queue status:
```bash
wrangler queues list
```

### Pages Build Failures
- Check build logs in Cloudflare Dashboard
- Verify `package.json` scripts
- Ensure all dependencies are listed

## Cost Estimation

Cloudflare has generous free tiers:

- **Pages**: 500 builds/month, unlimited requests
- **Workers**: 100,000 requests/day free
- **D1**: 5GB storage, 5M reads/day free
- **Queues**: 1M operations/month free

For worldwide usage, expect minimal costs initially.

## Security

### API Keys
- Store in Workers secrets: `wrangler secret put API_SECRET_KEY`
- Never commit to Git

### CORS
Configure in Workers to allow frontend domain only.

### Rate Limiting
Implement in Workers to prevent abuse.

## Backup

### Database Backups
```bash
# Export database
wrangler d1 execute smallaviationmonitor-db --command="SELECT * FROM devices" > backup.sql
```

Set up regular automated backups via GitHub Actions.

## Support

- Cloudflare Docs: https://developers.cloudflare.com
- Wrangler Docs: https://developers.cloudflare.com/workers/wrangler
- Community: https://discord.cloudflare.com
