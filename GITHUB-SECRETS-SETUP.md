# GitHub Secrets Setup Guide

## Overview

The GitHub Actions workflow (`.github/workflows/deploy.yml`) requires three secrets to deploy to Cloudflare. These must be added manually via the GitHub web interface.

## Required Secrets

### 1. CLOUDFLARE_API_TOKEN

**Purpose**: Allows GitHub Actions to deploy to Cloudflare Pages and Workers.

**How to get it**:
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click on your profile icon (top right) → **My Profile**
3. Navigate to **API Tokens** tab
4. Click **Create Token**
5. Use the **Edit Cloudflare Workers** template (or create custom with these permissions):
   - Account → Cloudflare Pages → Edit
   - Account → Cloudflare Workers Scripts → Edit
6. Click **Continue to summary** → **Create Token**
7. Copy the token (you won't see it again!)

### 2. CLOUDFLARE_ACCOUNT_ID

**Purpose**: Identifies your Cloudflare account for deployments.

**How to get it**:
1. Open `backend/wrangler.toml` in this repository
2. Look for the `account_id` field
3. Copy the value (format: `1121916dc461e5864bcb2da2fbfc351e`)

**OR**:
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click on **Workers & Pages** in the left sidebar
3. Your Account ID is displayed on the right side of the page

### 3. VITE_GOOGLE_MAPS_API_KEY

**Purpose**: Enables Google Maps integration in the frontend.

**How to get it**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (if you don't have one)
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **API Key**
5. (Recommended) Restrict the key:
   - Click **Edit API Key**
   - Under **Application restrictions**: Set to **HTTP referrers**
   - Add: `https://smallaviationmonitor.pages.dev/*`
   - Under **API restrictions**: Select **Restrict key** → Enable **Maps JavaScript API**
6. Copy the API key

## Adding Secrets to GitHub

1. Go to your repository on GitHub: `https://github.com/mihrans/SmallAviationMonitor`
2. Click **Settings** tab (top right)
3. In the left sidebar, navigate to **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. For each secret:
   - **Name**: Enter the secret name exactly as listed above (e.g., `CLOUDFLARE_API_TOKEN`)
   - **Secret**: Paste the value you obtained
   - Click **Add secret**
6. Repeat for all three secrets

## Verification

After adding all three secrets, you should see them listed on the **Actions secrets** page:
- ✅ CLOUDFLARE_API_TOKEN
- ✅ CLOUDFLARE_ACCOUNT_ID
- ✅ VITE_GOOGLE_MAPS_API_KEY

## Triggering a Deployment

Once secrets are added:
1. Push any commit to the `main` branch
2. GitHub Actions will automatically run the deployment workflow
3. Check the **Actions** tab to monitor progress
4. Once complete, verify the live site at `https://smallaviationmonitor.pages.dev/`

## Security Notes

- **Never commit secrets to the repository** - they should only exist in GitHub Secrets
- **Never paste secrets in chat or issues** - use GitHub Secrets UI only
- **Rotate tokens periodically** - especially if you suspect they've been compromised
- **Restrict API keys** - limit by referrer/domain and API permissions

## Troubleshooting

**Error: "Context access might be invalid: CLOUDFLARE_API_TOKEN"**
- This means the secret is not configured in GitHub. Follow the steps above.

**Error: "Unrecognized named-value: 'secrets'"**
- This is a linting warning, not an actual error. The workflow will work once secrets are added.

**Deployment fails with "Unauthorized"**
- Double-check the CLOUDFLARE_API_TOKEN has correct permissions
- Verify the CLOUDFLARE_ACCOUNT_ID matches your account

**Google Maps not loading**
- Check that VITE_GOOGLE_MAPS_API_KEY is set
- Verify the key is enabled for Maps JavaScript API in Google Cloud Console
- Check browser console for specific error messages
