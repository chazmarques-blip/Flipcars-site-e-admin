# 🚨 CRITICAL FIX: Railway Environment Variables

## Problem Identified

The backend on Railway is connected to the **WRONG** Supabase database instance!

- **Current (wrong)**: `kvjvieekkudeqtnunqlb.supabase.co`
- **Correct**: `nsvzqehytuqwfaerzmau.supabase.co`

This is why leads are not appearing - the backend is querying an empty database.

## Solution: Update Railway Environment Variables

### Step 1: Go to Railway Dashboard
1. Open [Railway Dashboard](https://railway.app/dashboard)
2. Select the FlipCars backend project
3. Go to **Variables** tab

### Step 2: Update These Variables

Replace the existing variables with the correct ones:

```env
DATABASE_URL=postgresql://postgres.nsvzqehytuqwfaerzmau:gx76iL2xSJnNKlFx@aws-0-us-east-1.pooler.supabase.com:6543/postgres

SUPABASE_URL=https://nsvzqehytuqwfaerzmau.supabase.co

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zdnpxZWh5dHVxd2ZhZXJ6bWF1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTEyMzkzMywiZXhwIjoyMDQ2Njk5OTMzfQ.5oMOO5VuGdRTM9F8Ye28kHLpgpxgMNGxcUixhwfY9pE
```

### Step 3: Redeploy

After updating the variables, Railway will automatically redeploy the backend with the correct database connection.

### Step 4: Verify

Wait ~2 minutes for deployment, then test:

```bash
./scripts/test-production-health.sh
```

You should see leads appearing now!

## Why This Happened

The backend `.env` file had the old database credentials, and these were likely copied to Railway when first deployed. The .env file is gitignored (correctly), so updates don't sync automatically.

## Prevention

Always verify environment variables in deployment platforms match the correct Supabase instance before deploying.
