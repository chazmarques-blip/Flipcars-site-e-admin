# 🚂 Railway Deployment Guide - FlipCars Backend API

**Complete step-by-step guide to deploy the FlipCars backend API on Railway**

---

## 📋 Prerequisites

- [ ] Railway account (sign up at https://railway.app)
- [ ] GitHub repository access
- [ ] Domain access (GoDaddy for api.flipcars.us)
- [ ] OpenAI API key (optional, for AI features)
- [ ] JWT secrets generated

---

## 🎯 Deployment Overview

**What we're deploying:**
- NestJS Backend API
- PostgreSQL Database
- Custom domain: api.flipcars.us

**Estimated time:** 30-45 minutes

---

## 📦 Step 1: Prepare Railway Account

### 1.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Authorize Railway to access your repositories

### 1.2 Install Railway CLI (Optional)
```bash
# macOS / Linux
curl -fsSL https://railway.app/install.sh | sh

# Or via npm
npm install -g @railway/cli

# Login
railway login
```

---

## 🗄️ Step 2: Create New Project

### 2.1 Create Project in Railway Dashboard

1. **Login to Railway:** https://railway.app/dashboard
2. **Click "New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Choose repository:** `chazmarques-blip/Flipcars-site-e-admin`
5. **Select branch:** `main`
6. **Project name:** `flipcars-backend`

### 2.2 Configure Build Settings

1. **Root Directory:** `/backend`
2. **Build Command:** `npm install && npm run build`
3. **Start Command:** `npm run start:prod`
4. **Or let Railway auto-detect** (uses railway.json)

---

## 🐘 Step 3: Add PostgreSQL Database

### 3.1 Add PostgreSQL Service

1. **In your project**, click **"+ New"**
2. Select **"Database" → "PostgreSQL"**
3. Railway will provision a PostgreSQL instance automatically
4. **Note:** PostgreSQL variables are auto-injected:
   - `PGHOST`
   - `PGPORT` 
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`
   - `DATABASE_URL`

### 3.2 Wait for Database Provisioning
- Takes ~2-3 minutes
- Green checkmark appears when ready

---

## 🔐 Step 4: Configure Environment Variables

### 4.1 Generate JWT Secrets

**On your local machine:**
```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate JWT_REFRESH_SECRET (use different value!)
openssl rand -base64 32
```

### 4.2 Add Environment Variables in Railway

1. **Go to your backend service** (not database)
2. **Click "Variables" tab**
3. **Add these variables:**

#### **Required Variables:**

```env
# Application
NODE_ENV=production
PORT=3001

# Frontend URLs (CORS)
FRONTEND_URL=https://flipcars.us,https://www.flipcars.us,https://admin.flipcars.us

# Database (Auto-provided by Railway PostgreSQL)
DATABASE_TYPE=postgres
DATABASE_SYNCHRONIZE=false
DATABASE_LOGGING=false

# JWT Secrets (Use generated values from Step 4.1)
JWT_SECRET=<paste-generated-secret-here>
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=<paste-different-generated-secret-here>
JWT_REFRESH_EXPIRATION=7d
```

#### **Optional Variables (add later):**

```env
# OpenAI (for AI features)
OPENAI_API_KEY=sk-your-key
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7

# Email (SendGrid)
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your-key
EMAIL_FROM=noreply@flipcars.us
EMAIL_FROM_NAME=FlipCars

# AWS S3 (file uploads)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=flipcars-uploads-prod
```

### 4.3 Save and Deploy
- Click **"Deploy"** or wait for auto-deploy
- Railway will rebuild with new environment variables

---

## 🚀 Step 5: Initial Deployment

### 5.1 Monitor Deployment

1. **Go to "Deployments" tab**
2. **Watch build logs**
3. **Wait for "Success" status** (~3-5 minutes)

### 5.2 Check Build Logs

Look for:
```
✓ Build successful
✓ Starting application
🚀 FlipCars Backend API running on: http://localhost:3001/api
📚 Environment: production
🌐 CORS enabled for origins: [...]
```

### 5.3 Get Railway URL

1. **Go to "Settings" tab**
2. **Find "Domains" section**
3. **Copy the Railway-provided domain**
   - Example: `flipcars-backend-production.up.railway.app`

### 5.4 Test the API

```bash
# Health check
curl https://your-railway-domain.up.railway.app/api/health

# Expected response:
{"status":"ok","timestamp":"2025-11-07T..."}
```

---

## 🗄️ Step 6: Run Database Migrations

### 6.1 Option A: Using Railway CLI

```bash
# Link to your project
railway link

# Run migrations
railway run npm run migration:run

# Seed initial data (creates admin users)
railway run npm run seed
```

### 6.2 Option B: Using Railway Dashboard

1. **Go to your backend service**
2. **Click "..." menu → "Run Command"**
3. **Enter:** `npm run migration:run`
4. **Wait for completion**
5. **Run seed:** `npm run seed`

### 6.3 Verify Database Setup

Check logs for:
```
✓ Migrations executed successfully
✓ Seed data created: 3 users
```

**Test users created:**
- `superadmin@flipcars.us` / `Password123!`
- `admin@flipcars.us` / `Password123!`
- `agent@flipcars.us` / `Password123!`

---

## 🌐 Step 7: Configure Custom Domain (api.flipcars.us)

### 7.1 Add Domain in Railway

1. **Go to "Settings" → "Domains"**
2. **Click "Add Custom Domain"**
3. **Enter:** `api.flipcars.us`
4. **Railway will show CNAME target**
   - Example: `flipcars-backend-production.up.railway.app`

### 7.2 Configure DNS in GoDaddy

1. **Login to GoDaddy:** https://dcc.godaddy.com/control/flipcars.us/dns
2. **Add CNAME Record:**
   - **Type:** CNAME
   - **Name:** api
   - **Value:** `<railway-cname-target>` (from Railway)
   - **TTL:** 600 seconds (10 minutes)
3. **Save changes**

### 7.3 Wait for DNS Propagation

```bash
# Check DNS propagation
nslookup api.flipcars.us

# Or use online tool
# https://dnschecker.org/#CNAME/api.flipcars.us
```

**Typical propagation time:** 5-20 minutes

### 7.4 Verify Custom Domain

```bash
# Test API via custom domain
curl https://api.flipcars.us/api/health

# Expected: {"status":"ok"}
```

---

## ✅ Step 8: Verify Deployment

### 8.1 Test Health Endpoint

```bash
curl https://api.flipcars.us/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-07T18:30:00.000Z",
  "database": "connected",
  "environment": "production"
}
```

### 8.2 Test Login Endpoint

```bash
curl -X POST https://api.flipcars.us/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@flipcars.us",
    "password": "Password123!"
  }'
```

**Expected response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "superadmin@flipcars.us",
    "role": "super_admin"
  }
}
```

### 8.3 Test Admin Dashboard Login

1. **Open:** https://admin.flipcars.us
2. **Try logging in:**
   - Email: `superadmin@flipcars.us`
   - Password: `Password123!`
3. **Should redirect to dashboard** 🎉

---

## 🔧 Step 9: Update Frontend Environment Variables

### 9.1 Update Vercel Environment Variables

**For Admin Dashboard (admin.flipcars.us):**

1. **Go to Vercel:** https://vercel.com/charles-marques-projects/frontend-admin
2. **Settings → Environment Variables**
3. **Update:**
   ```
   NEXT_PUBLIC_API_URL=https://api.flipcars.us
   ```
4. **Save and redeploy**

**For Public Site (flipcars.us):**

1. **Go to Vercel:** https://vercel.com/charles-marques-projects/frontend-public
2. **Settings → Environment Variables**
3. **Add/Update:**
   ```
   NEXT_PUBLIC_API_URL=https://api.flipcars.us
   ```
4. **Save and redeploy**

### 9.2 Trigger Redeployments

**Option A - Via Vercel Dashboard:**
- Deployments → Click "..." → Redeploy

**Option B - Via Git:**
```bash
cd /home/user/webapp
git commit --allow-empty -m "chore: trigger deployment after backend setup"
git push origin main
```

---

## 🎉 Step 10: Final Verification

### 10.1 Complete System Test

1. ✅ **Backend API:** https://api.flipcars.us/api/health
2. ✅ **Admin Login:** https://admin.flipcars.us
3. ✅ **Public Site:** https://flipcars.us
4. ✅ **Estimate Form:** Submit test lead

### 10.2 Test Full Flow

1. **Open:** https://flipcars.us
2. **Click "Free Estimate"**
3. **Fill out form** (use test data)
4. **Submit**
5. **Check admin dashboard** for new lead

---

## 🐛 Troubleshooting

### Issue: Build Failed

**Check:**
- Build logs in Railway dashboard
- Ensure all dependencies are in `package.json`
- Verify `railway.json` is correct

**Fix:**
```bash
cd /home/user/webapp/backend
npm install
npm run build
```

### Issue: Database Connection Failed

**Check:**
- PostgreSQL service is running (green checkmark)
- Environment variables are set correctly
- `DATABASE_URL` is auto-injected by Railway

**Fix:**
1. Restart PostgreSQL service
2. Restart backend service
3. Check logs for connection errors

### Issue: CORS Errors

**Check:**
- `FRONTEND_URL` includes all domains
- Domains are comma-separated
- No trailing slashes

**Fix:**
```env
FRONTEND_URL=https://flipcars.us,https://www.flipcars.us,https://admin.flipcars.us
```

### Issue: JWT Errors

**Check:**
- `JWT_SECRET` and `JWT_REFRESH_SECRET` are set
- Secrets are at least 32 characters
- Secrets are different from each other

**Fix:**
```bash
# Generate new secrets
openssl rand -base64 32
```

### Issue: 502 Bad Gateway

**Check:**
- Application is listening on `0.0.0.0` (not `localhost`)
- Port is set to `3001` or `$PORT`
- Health endpoint returns 200 OK

**Fix:**
```typescript
// main.ts
await app.listen(port, '0.0.0.0');
```

---

## 📊 Monitoring & Logs

### View Application Logs

**In Railway Dashboard:**
1. Go to your backend service
2. Click "Logs" tab
3. Filter by severity: Info, Warn, Error

**Via CLI:**
```bash
railway logs
```

### Database Monitoring

1. Click PostgreSQL service
2. View metrics: CPU, Memory, Storage
3. Access pgAdmin if needed (external tool)

---

## 🔒 Security Checklist

- [x] JWT secrets are strong (32+ characters)
- [x] Database password is auto-generated by Railway
- [x] CORS only allows specific domains
- [x] `NODE_ENV=production`
- [x] `DATABASE_SYNCHRONIZE=false` (prevents auto-schema changes)
- [x] Rate limiting enabled
- [ ] Setup monitoring/alerting (Sentry, etc.)
- [ ] Enable Railway security features
- [ ] Regular backups configured

---

## 💰 Cost Estimate

**Railway Pricing (as of 2025):**

- **Hobby Plan:** $5/month
  - 500 hours of usage
  - Includes PostgreSQL
  - Custom domains
  - Good for development/staging

- **Pro Plan:** $20/month + usage
  - Unlimited usage
  - Better performance
  - Team features
  - Recommended for production

**Estimated monthly cost:** $5-25 depending on traffic

---

## 📚 Additional Resources

**Railway Documentation:**
- https://docs.railway.app

**NestJS Documentation:**
- https://docs.nestjs.com

**PostgreSQL on Railway:**
- https://docs.railway.app/databases/postgresql

**Railway CLI:**
- https://docs.railway.app/develop/cli

---

## 🆘 Support

**Issues?**
- Check Railway status: https://status.railway.app
- Railway Discord: https://discord.gg/railway
- Check backend logs first

**Backend Repository:**
- https://github.com/chazmarques-blip/Flipcars-site-e-admin

---

## ✅ Deployment Checklist

- [ ] Railway account created
- [ ] Project created from GitHub
- [ ] PostgreSQL database added
- [ ] Environment variables configured
- [ ] JWT secrets generated and added
- [ ] Initial deployment successful
- [ ] Database migrations run
- [ ] Seed data created
- [ ] Custom domain added (api.flipcars.us)
- [ ] DNS configured in GoDaddy
- [ ] DNS propagated
- [ ] Health endpoint tested
- [ ] Login endpoint tested
- [ ] Admin dashboard login works
- [ ] Estimate form submission works
- [ ] Frontend environment variables updated
- [ ] Frontend redeployed

---

**Deployment completed! 🎉**

**API URL:** https://api.flipcars.us  
**Admin Login:** superadmin@flipcars.us / Password123!

*Last updated: 2025-11-07*
