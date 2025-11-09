# FlipCars Deployment - Complete Technical Summary

**Date:** 2025-11-08  
**Status:** ✅ RESOLVED  
**Duration:** Extended troubleshooting session

---

## 🎯 Final Solution Summary

### Problem Root Cause
The frontend was unable to login because `vercel.json` had a **hardcoded** environment variable that was overriding all other configurations:

```json
"env": {
  "NEXT_PUBLIC_API_URL": "https://api.flipcars.us"  // ❌ WRONG URL
}
```

### Solution Applied
1. **Removed hardcoded env** from `vercel.json`
2. **Configured environment variable** in Vercel Dashboard
3. **Forced cache invalidation** with dummy commit
4. **Redeployed** to production

---

## 🔧 Complete System Configuration

### Backend (Railway)
- **Service:** upbeat-dedication
- **URL:** https://upbeat-dedication-production.up.railway.app
- **Database:** PostgreSQL (Maglev proxy)
- **Status:** ✅ Running (200 OK)

#### Database Connection
```
DATABASE_URL=postgresql://postgres:jNZrCPxxpIeOqyfrhlRIFHvGzzAAioMb@maglev.proxy.rlwy.net:58259/railway
```

#### Tables Created (21 total)
- users, roles, user_roles (authentication)
- leads, claims, claim_files (business logic)
- customers, vehicles, appointments
- estimates, invoices, payments
- notes, tags, notifications
- migrations (schema versioning)

### Frontend (Vercel)
- **Domain:** https://admin.flipcars.us
- **Project:** frontend-admin
- **Environment Variable:** `NEXT_PUBLIC_API_URL=https://upbeat-dedication-production.up.railway.app/api`

---

## 👤 Admin User Credentials

**Email:** admin@flipcars.com  
**Password:** Admin123!  
**Role:** superadmin  
**User ID:** 00000000-0000-0000-0000-000000000001  
**Role ID:** 00000000-0000-0000-0000-000000000001

### Password Hash
```
$2b$10$9kE7vps6NfrE81B6neRGM.o1k6lPcKDxlYZMqi5UPvDN5nPH0vizS
```

---

## 📝 Critical Files Modified

### 1. `/backend/src/database/data-source.ts`
**Purpose:** Database connection configuration  
**Change:** Prioritize DATABASE_URL with SSL for Railway

```typescript
const buildDatabaseConfig = (): DataSourceOptions => {
  if (process.env.DATABASE_URL) {
    return {
      ...baseConfig,
      url: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    };
  }
  // Fallback to individual params
};
```

### 2. `/backend/src/main.ts`
**Purpose:** Application entry point  
**Change:** Added automatic migrations and seeds on startup

```typescript
async function bootstrap() {
  if (process.env.NODE_ENV === 'production') {
    const migrationsSucceeded = await runMigrations();
    if (migrationsSucceeded) {
      await runDatabaseSeeds();
    }
  }
  const app = await NestFactory.create(AppModule);
  // ... rest of configuration
}
```

### 3. `/frontend-admin/vercel.json`
**Purpose:** Vercel deployment configuration  
**Before:**
```json
{
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.flipcars.us"  // ❌ WRONG
  }
}
```

**After:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### 4. `/frontend-admin/.env.production`
**Purpose:** Production environment variables  
**Content:**
```env
NEXT_PUBLIC_API_URL=https://upbeat-dedication-production.up.railway.app/api
NEXT_PUBLIC_APP_NAME=FlipCars 2.0 Admin
NEXT_PUBLIC_APP_ENV=production
```

---

## 🔍 Troubleshooting Steps Taken

### Phase 1: Railway Backend Setup
1. ✅ Connected to Railway API using token
2. ✅ Identified backend service and database
3. ✅ Verified backend health check (200 OK)
4. ✅ Configured DATABASE_URL with SSL

### Phase 2: Database Schema
1. ✅ Discovered empty migration file
2. ✅ Used TypeORM synchronize() to create tables
3. ✅ Verified all 21 tables created successfully
4. ✅ Checked column naming (snake_case vs camelCase)

### Phase 3: User Creation
1. ✅ Generated bcrypt password hash
2. ✅ Created superadmin role
3. ✅ Created admin user with correct schema
4. ✅ Associated user with role via junction table

### Phase 4: Backend Testing
1. ✅ Tested login endpoint via curl
2. ✅ Verified JWT token generation
3. ✅ Confirmed CORS configuration
4. ✅ Validated API responses

### Phase 5: Frontend Configuration
1. ❌ Initial attempt: Updated .env.production (overridden)
2. ❌ Second attempt: Added Vercel env var (overridden)
3. ❌ Third attempt: Updated vercel.json env (cache issue)
4. ✅ **Final solution:** Removed vercel.json env + Vercel dashboard var

### Phase 6: Cache Invalidation
1. ✅ Created cache-bust dummy file
2. ✅ Forced new Vercel deployment
3. ✅ Verified new build serving correct URL

---

## 🐛 Common Issues & Solutions

### Issue 1: "Login failed. Please try again."
**Cause:** Frontend calling wrong API URL  
**Solution:** Check Vercel env vars + clear vercel.json hardcoded env

### Issue 2: "relation 'users' does not exist"
**Cause:** Migrations not running / empty migration file  
**Solution:** Use TypeORM synchronize() or populate migration file

### Issue 3: Vercel not updating after deploy
**Cause:** CDN cache + build ID not changing  
**Solution:** Remove hardcoded env from vercel.json + force cache invalidation

### Issue 4: Database connection fails on Railway
**Cause:** Missing SSL configuration  
**Solution:** Add `ssl: { rejectUnauthorized: false }` to DataSource config

---

## 🚀 Railway Backend Configuration

### Environment Variables Required
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://postgres:password@host:port/database

# JWT Secrets
JWT_SECRET=7yP1wyX8Lt3e64Czu8Pem/SSrl6MBDaeQpz2KipBoFE=
JWT_REFRESH_SECRET=gl5DhoFTM39reheJrtVLlZLc/L46o/OlKH3Y5X0M6zo=
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# CORS
CORS_ORIGIN=https://admin.flipcars.us
```

### Startup Script (`start-production.sh`)
```bash
#!/bin/bash
set -e

echo "🚀 FlipCars Backend - Production Start"
echo "Environment: ${NODE_ENV:-production}"

# Validate DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL not set!"
    exit 1
fi

echo "⏳ Waiting for database (5 seconds)..."
sleep 5

echo "🎯 Starting NestJS Application..."
exec node dist/main.js
```

---

## 🌐 Vercel Frontend Configuration

### Environment Variables (Dashboard)
```
NEXT_PUBLIC_API_URL=https://upbeat-dedication-production.up.railway.app/api
```

### Build Configuration
- **Framework:** Next.js
- **Build Command:** npm run build
- **Output Directory:** .next
- **Install Command:** npm install
- **Node Version:** 20.x

---

## 📊 Database Schema (Key Tables)

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### roles
```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### user_roles (junction table)
```sql
CREATE TABLE user_roles (
  user_id UUID REFERENCES users(id),
  role_id UUID REFERENCES roles(id),
  PRIMARY KEY (user_id, role_id)
);
```

---

## 🧪 Testing & Verification

### Backend Health Check
```bash
curl https://upbeat-dedication-production.up.railway.app/api/health
# Expected: 200 OK
```

### Login Test
```bash
curl -X POST https://upbeat-dedication-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@flipcars.com",
    "password": "Admin123!"
  }'
```

**Expected Response:**
```json
{
  "user": {
    "id": "00000000-0000-0000-0000-000000000001",
    "name": "Admin FlipCars",
    "email": "admin@flipcars.com",
    "roles": ["superadmin"]
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Frontend Login Test
1. Navigate to: https://admin.flipcars.us/auth/login
2. Enter credentials: admin@flipcars.com / Admin123!
3. Click "Sign In"
4. Expected: Redirect to /dashboard with JWT tokens in localStorage

---

## 🔐 Security Configurations

### CORS
```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN || 'https://admin.flipcars.us',
  credentials: true,
});
```

### JWT Strategy
- **Access Token:** 15 minutes expiration
- **Refresh Token:** 7 days expiration
- **Algorithm:** HS256
- **Storage:** localStorage (frontend)

---

## 📦 Git Commits Applied

1. `ef15b82a` - fix: update vercel.json with correct Railway API URL
2. `efa19ad2` - fix: remove hardcoded env from vercel.json
3. `3be01041` - chore: force Vercel cache invalidation
4. `1cb5c856` - chore: force Vercel redeploy with env variables
5. `da1c9ac7` - Merge pull request #3 (migrations and seeds)

---

## 🎓 Key Learnings

### Next.js Environment Variables Priority
1. **vercel.json `env`** (highest priority) ← **This was the problem!**
2. Vercel Dashboard Environment Variables
3. `.env.local` (not committed to git)
4. `.env.production` (production builds)
5. `.env` (fallback)

### Railway Deployment Best Practices
- Always use `DATABASE_URL` over individual connection params
- Enable SSL for PostgreSQL connections: `ssl: { rejectUnauthorized: false }`
- Wait 5-10 seconds after container start before accepting requests
- Use health check endpoints for monitoring

### Vercel Deployment Best Practices
- Never hardcode env vars in `vercel.json`
- Use Dashboard Environment Variables for sensitive data
- Force cache invalidation with dummy commits when needed
- Test with hard refresh (Cmd/Ctrl + Shift + R) after deploys

---

## 📋 Quick Reference Commands

### Railway CLI
```bash
# Login to Railway
railway login

# Link to project
railway link

# View logs
railway logs

# Set environment variable
railway variables set KEY=value
```

### Vercel CLI
```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# View deployments
vercel ls

# Set environment variable
vercel env add NEXT_PUBLIC_API_URL production
```

### Database Access
```bash
# Connect to PostgreSQL
psql "postgresql://postgres:jNZrCPxxpIeOqyfrhlRIFHvGzzAAioMb@maglev.proxy.rlwy.net:58259/railway"

# List tables
\dt

# Describe table
\d users

# Query users
SELECT * FROM users;
```

---

## 🔄 Deployment Workflow

### Backend (Railway)
1. Push code to GitHub `main` branch
2. Railway auto-deploys from GitHub integration
3. Migrations run automatically on startup (via main.ts)
4. Seeds run after migrations complete
5. Health check endpoint becomes available

### Frontend (Vercel)
1. Push code to GitHub `main` branch
2. Vercel auto-deploys via GitHub integration
3. Environment variables loaded from Dashboard
4. Next.js builds with production config
5. CDN cache updated globally

---

## ✅ Final Checklist

- [x] Backend deployed to Railway
- [x] Database migrated and seeded
- [x] Admin user created
- [x] Backend health check passing
- [x] Login endpoint tested
- [x] Frontend deployed to Vercel
- [x] Environment variables configured
- [x] vercel.json cleaned up
- [x] Cache invalidated
- [x] Login functionality verified

---

## 🆘 Emergency Rollback

If deployment fails, rollback steps:

1. **Railway:** Redeploy previous deployment from dashboard
2. **Vercel:** Redeploy previous deployment from dashboard
3. **Database:** Restore from Railway backup
4. **Git:** Revert commits and force push

```bash
git revert HEAD~3..HEAD
git push origin main --force
```

---

## 📞 Support Contacts

- **Railway Dashboard:** https://railway.app/dashboard
- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repository:** https://github.com/chazmarques-blip/Flipcars-site-e-admin

---

## 📚 Additional Resources

- Next.js Environment Variables: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
- Railway Documentation: https://docs.railway.app
- Vercel Documentation: https://vercel.com/docs
- TypeORM Migrations: https://typeorm.io/migrations
- NestJS Configuration: https://docs.nestjs.com/techniques/configuration

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-08  
**Author:** GenSpark AI Assistant

