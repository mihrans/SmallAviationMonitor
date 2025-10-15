# Google Maps API Key Setup Guide

## Overview
The Google Maps API key is managed differently for local development vs production:

### For Local Development (Your Machine)
**File**: Create `.env.local` (gitignored, not committed)
```bash
VITE_GOOGLE_MAPS_API_KEY=AIzaSyCEBVo1mvxahDOzWH_s_vlcVfMXOjA54R4
```

**Why `.env.local`?**
- ✅ Gitignored automatically (`.gitignore` has `*.local`)
- ✅ Overrides all other .env files
- ✅ Your actual API key stays private
- ✅ Each developer has their own key

**Steps:**
1. Copy `.env.local.example` to `.env.local`
2. Replace `your_google_maps_api_key_here` with your actual key
3. Run `npm run dev`

### For Production (Cloudflare Pages)
**Method**: Environment Variables in Cloudflare Dashboard

**Type**: **TEXT** (not Secret)
- Use "Text" type for Vite environment variables
- Vite needs to read them at build time
- "Secret" type is for runtime-only values

**Steps:**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to: **Pages** → **smallaviationmonitor** → **Settings** → **Environment variables**
3. Click **"+ Add variable"**
4. Set:
   - **Variable name**: `VITE_GOOGLE_MAPS_API_KEY`
   - **Type**: **Text** (not Secret!)
   - **Value**: `AIzaSyCEBVo1mvxahDOzWH_s_vlcVfMXOjA54R4`
   - **Environment**: Production (and Preview if you want)
5. Click **"Save"**
6. **Redeploy** the site (or push new commit)

### Configuration Files in Git (Committed)

**`.env.production`** (committed)
```bash
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```
- Default/placeholder value
- Overridden by Cloudflare environment variable
- Safe to commit (no real key)

**`.env.development`** (committed)
```bash
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```
- Default/placeholder value for dev mode
- Overridden by `.env.local` when it exists
- Safe to commit (no real key)

**`.env.local.example`** (committed)
- Template file with instructions
- Shows developers what to create
- Safe to commit (example only)

**`.env.local`** (NOT committed - gitignored)
- Your actual API key
- Never committed to git
- Each developer creates their own

## Priority Order
Vite loads environment variables in this order (last wins):
1. `.env` (base)
2. `.env.local` (local overrides, gitignored)
3. `.env.[mode]` (e.g., `.env.development` or `.env.production`)
4. `.env.[mode].local` (e.g., `.env.development.local`, gitignored)
5. **Cloudflare Environment Variables** (for production builds)

## Security Notes
- ✅ `.env.local` is gitignored (your real key never goes to GitHub)
- ✅ `.env.production` has placeholder (safe to commit)
- ✅ Cloudflare environment variables override everything in production
- ✅ Private repo = extra security layer
- ⚠️ Still restrict API key to your domain in Google Cloud Console

## Testing

**Local Development:**
```bash
cd frontend
# Create .env.local with your API key
echo "VITE_GOOGLE_MAPS_API_KEY=AIzaSyCEBVo1mvxahDOzWH_s_vlcVfMXOjA54R4" > .env.local
npm run dev
```
Visit http://localhost:5173 - map should load with device markers

**Production:**
1. Set environment variable in Cloudflare (see above)
2. Push to GitHub
3. Wait for auto-deployment
4. Visit https://smallaviationmonitor.pages.dev
5. Map should load with device markers

## Troubleshooting

**Map shows "Google Maps API Key Required":**
- Local: Check `.env.local` exists and has correct key
- Production: Check Cloudflare environment variable is set as **Text** (not Secret)

**Map shows "This page can't load Google Maps correctly":**
- API key is invalid
- Maps JavaScript API not enabled in Google Cloud
- Domain restrictions blocking localhost or Cloudflare domain

**Changes not reflected:**
- Local: Restart `npm run dev`
- Production: Environment variable changes require redeploy

## Current Status
- ✅ `.env.local.example` - Template committed
- ✅ `.env.development` - Default committed
- ✅ `.env.production` - Default committed
- ⏳ `.env.local` - You need to create this with your API key
- ⏳ Cloudflare env var - You need to set this (Type: **Text**)
