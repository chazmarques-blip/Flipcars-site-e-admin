# 🔧 Fix Database Configuration - FlipCars Project
## Date: 2024-11-10

---

## ⚠️ **CRITICAL ISSUE IDENTIFIED**

The FlipCars backend is currently connected to the **WRONG Supabase database**:
- ❌ Current (Wrong): **"Flipcars-site-e-admin"** (AWS us-east-1)
- ✅ Correct (Should be): **"My Truck Admin"** (AWS us-east-2)

**All FlipCars data should be stored in the "My Truck Admin" project.**

---

## 📋 **STEP-BY-STEP FIX GUIDE**

### **Step 1: Get the Correct Database URL from Supabase**

1. Log in to [Supabase Dashboard](https://app.supabase.com)
2. Select **"My Truck Admin"** project
3. Go to **Settings** (gear icon in left sidebar) → **Database**
4. Scroll down to **Connection String** section
5. Copy the **"Connection Pooling"** or **"Direct Connection"** URL
   - It will look like: `postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-2.pooler.supabase.com:5432/postgres`

**⚠️ IMPORTANT**: You need to replace `[YOUR-PASSWORD]` with your actual database password!

6. To find your password:
   - Go to **Settings** → **Database** → **Database Password**
   - If you don't remember it, you can **reset it** (but this will break existing connections temporarily)

---

### **Step 2: Update Railway Environment Variables**

1. Log in to [Railway Dashboard](https://railway.app)
2. Select your **FlipCars Backend** project/service
3. Go to **Variables** tab
4. Find or add the **`DATABASE_URL`** variable
5. **Replace** its value with the correct Supabase connection string from Step 1

**Example Format:**
```
postgresql://postgres.xxxxxxxxxxxx:YourPassword@aws-0-us-east-2.pooler.supabase.com:5432/postgres
```

**Alternative**: If Railway uses individual variables instead of DATABASE_URL:
- `PGHOST`: `aws-0-us-east-2.pooler.supabase.com`
- `PGPORT`: `5432`
- `PGUSER`: `postgres.xxxxxxxxxxxx`
- `PGPASSWORD`: `YourPassword`
- `PGDATABASE`: `postgres`

---

### **Step 3: Verify Other Environment Variables**

While you're in Railway Variables, ensure these are also set correctly:

#### Required Variables:
- ✅ `NODE_ENV`: `production`
- ✅ `PORT`: `3001` (or Railway's default)
- ✅ `FRONTEND_URL`: `https://flipcars.us,https://www.flipcars.us,https://admin.flipcars.us`
- ✅ `JWT_SECRET`: Your secure JWT secret (min 32 characters)
- ✅ `JWT_REFRESH_SECRET`: Different secure secret (min 32 characters)
- ✅ `DATABASE_SYNCHRONIZE`: `false` (IMPORTANT: Never true in production!)
- ✅ `DATABASE_LOGGING`: `false` (or `true` for debugging)

#### Optional (for future Supabase Storage):
- `SUPABASE_URL`: Get from "My Truck Admin" → Settings → API → Project URL
- `SUPABASE_ANON_KEY`: Get from "My Truck Admin" → Settings → API → anon public key
- `SUPABASE_SERVICE_KEY`: Get from "My Truck Admin" → Settings → API → service_role secret key

---

### **Step 4: Redeploy Railway Backend**

After updating the environment variables:

1. In Railway dashboard, click **"Redeploy"** or push a new commit to trigger deployment
2. Wait for deployment to complete (check logs)
3. Look for successful database connection in logs:
   ```
   [Nest] LOG [TypeOrmModule] Connected to database successfully
   ```

---

### **Step 5: Verify Database Connection**

Test the connection:

1. **Check Railway Logs**:
   - Look for database connection success/error messages
   - Should see: "Database connection established" or similar

2. **Test API Endpoint**:
   ```bash
   curl https://your-railway-backend.railway.app/api/health
   ```
   Should return `{"status":"ok"}` or similar

3. **Test Admin Login**:
   - Go to admin dashboard
   - Try logging in
   - If successful, database connection is working!

---

### **Step 6: Migrate Existing Data (If Needed)**

If you have important data in the **wrong database** ("Flipcars-site-e-admin") that needs to be moved:

#### Option A: Export & Import via Supabase Dashboard
1. In **"Flipcars-site-e-admin"** project:
   - Go to **Database** → **Backups** or use SQL Editor
   - Export tables (leads, users, etc.)
2. In **"My Truck Admin"** project:
   - Import the exported data

#### Option B: Use pg_dump/pg_restore (Advanced)
```bash
# Export from wrong database
pg_dump "postgresql://wrong-database-url" > flipcars_backup.sql

# Import to correct database
psql "postgresql://correct-database-url" < flipcars_backup.sql
```

---

## 🗂️ **NEXT: Implement Supabase Storage for Photos**

Once the database connection is fixed, we'll implement Supabase Storage to solve the photo persistence issue:

1. **Create Storage Bucket** in "My Truck Admin" project
2. **Install Supabase client** in backend: `npm install @supabase/supabase-js`
3. **Update upload controller** to use Supabase Storage instead of local filesystem
4. **Configure environment variables** (SUPABASE_URL, SUPABASE_SERVICE_KEY)

---

## 📝 **Summary Checklist**

- [ ] Get correct DATABASE_URL from "My Truck Admin" Supabase project
- [ ] Update Railway DATABASE_URL environment variable
- [ ] Verify other required environment variables (JWT secrets, etc.)
- [ ] Redeploy Railway backend
- [ ] Check logs for successful database connection
- [ ] Test API health endpoint
- [ ] Test admin dashboard login
- [ ] Migrate existing data if needed
- [ ] Implement Supabase Storage for photos (next step)

---

## 🆘 **Troubleshooting**

### "Connection refused" error:
- Check if Supabase connection string is correct
- Verify password is not URL-encoded incorrectly
- Try using "Direct Connection" instead of "Connection Pooling"

### "Authentication failed" error:
- Password might be incorrect
- Reset database password in Supabase
- Update Railway variable with new password

### "Database does not exist" error:
- Check PGDATABASE value (should be "postgres")
- Verify you're using the correct project's connection string

### Railway deployment fails:
- Check Railway logs for specific error
- Verify all required environment variables are set
- Ensure DATABASE_URL format is correct

---

## 📞 **Need Help?**

If you encounter issues:
1. Share Railway deployment logs
2. Share Supabase connection error messages
3. Verify you copied the correct connection string
4. Double-check password (common mistake!)

---

**After fixing the database, we'll implement Supabase Storage to permanently solve the photo upload issue!** 🚀
