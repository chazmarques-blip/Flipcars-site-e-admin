# 🔑 Supabase Credentials - Where to Find Everything
## Complete Visual Guide for "My Truck Admin" Project

---

## 🎯 **OVERVIEW**

You need to get credentials from the **"My Truck Admin"** Supabase project (NOT "Flipcars-site-e-admin").

### What You Need:
1. ✅ **DATABASE_URL** - For Railway backend connection
2. ✅ **SUPABASE_URL** - For Supabase Storage (Phase 2)
3. ✅ **SUPABASE_SERVICE_KEY** - For backend file uploads (Phase 2)

---

## 📋 **STEP-BY-STEP: Getting Database Credentials (Phase 1)**

### Step 1: Access Supabase Dashboard

1. Go to: **https://app.supabase.com**
2. Log in with your credentials
3. You should see a list of your projects

---

### Step 2: Select the Correct Project

**⚠️ CRITICAL**: Make sure you select **"My Truck Admin"**

```
┌─────────────────────────────────────────────┐
│  Your Supabase Projects                      │
├─────────────────────────────────────────────┤
│                                              │
│  ❌ Flipcars-site-e-admin                    │
│     AWS us-east-1                            │
│     [Don't select this one!]                 │
│                                              │
│  ✅ My Truck Admin                           │
│     AWS us-east-2                            │
│     [SELECT THIS ONE!]                       │
│                                              │
└─────────────────────────────────────────────┘
```

**Click on "My Truck Admin"** to open the project dashboard.

---

### Step 3: Navigate to Database Settings

Once inside "My Truck Admin" project:

```
Left Sidebar:
┌──────────────────┐
│ 🏠 Home          │
│ 📊 Table Editor  │
│ 🔐 Authentication│
│ 📦 Storage       │
│ 💻 SQL Editor    │
│ 📈 Reports       │
│ ⚙️  Settings     │  ← CLICK HERE
└──────────────────┘
```

1. Click the **⚙️ Settings** icon (gear icon) in the left sidebar
2. In the Settings menu, click **"Database"**

---

### Step 4: Find Connection String

On the Database page, scroll down to the **"Connection string"** section:

```
Connection string
├─ URI (Connection Pooling)  [Recommended for most use cases]
├─ URI (Direct Connection)   [For serverless functions]
├─ Session mode
└─ Transaction mode
```

**Select**: **URI (Connection Pooling)** ✅

You'll see a connection string like this:

```
postgresql://postgres.xxxxxxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-2.pooler.supabase.com:5432/postgres
```

**Important Notes:**
- ⚠️ You need to replace `[YOUR-PASSWORD]` with your actual database password
- ⚠️ Notice it says **`us-east-2`** (correct region)
- ⚠️ If it shows `us-east-1`, you selected the wrong project!

---

### Step 5: Get Your Database Password

The connection string has `[YOUR-PASSWORD]` - you need the real password:

**Option A: You Remember Your Password**
- Great! Just replace `[YOUR-PASSWORD]` with it
- Example: `postgresql://postgres.xxx:MySecurePassword123@aws-0-us-east-2...`

**Option B: You Don't Remember Your Password**

1. On the same Database page, scroll up to **"Database Password"** section
2. Click **"Reset Database Password"** button
3. Supabase will generate a new password and show it to you
4. **COPY THIS PASSWORD IMMEDIATELY** - you won't see it again!
5. ⚠️ Warning: Resetting the password will break any existing connections temporarily

---

### Step 6: Build Complete DATABASE_URL

Now combine everything:

```
postgresql://postgres.xxxxxxxxxxxx:YourActualPassword@aws-0-us-east-2.pooler.supabase.com:5432/postgres
                                  ^^^^^^^^^^^^^^^^^^^
                                  Replace [YOUR-PASSWORD] with actual password
```

**Example (with fake values):**
```
postgresql://postgres.abcdefghijklmnop:SuperSecret123@aws-0-us-east-2.pooler.supabase.com:5432/postgres
```

**Copy this complete URL** - you'll paste it into Railway in the next step.

---

### Step 7: Verify the URL

Before using it, double-check:

- ✅ Starts with `postgresql://`
- ✅ Contains **`us-east-2`** (not us-east-1)
- ✅ Has your actual password (not `[YOUR-PASSWORD]`)
- ✅ Ends with `:5432/postgres`
- ✅ No extra spaces or line breaks

---

## 📋 **STEP-BY-STEP: Getting Storage Credentials (Phase 2)**

**⚠️ Only do this AFTER Phase 1 (database) is complete!**

---

### Step 1: Navigate to API Settings

In "My Truck Admin" project:

```
Left Sidebar:
┌──────────────────┐
│ ⚙️  Settings     │  ← Click here
└──────────────────┘

Settings Menu:
┌──────────────────┐
│ General          │
│ Database         │
│ API              │  ← Then click here
│ Authentication   │
└──────────────────┘
```

1. Click **⚙️ Settings** in left sidebar
2. Click **"API"** in settings menu

---

### Step 2: Find Project URL

On the API page, you'll see:

```
Project URL
┌─────────────────────────────────────────────┐
│ https://xxxxxxxxxxxxx.supabase.co           │
└─────────────────────────────────────────────┘
```

**Copy this URL** - this is your `SUPABASE_URL`

Example: `https://abcdefghij.supabase.co`

---

### Step 3: Find API Keys

On the same API page, scroll down to **"Project API keys"**:

```
Project API keys
├─ anon public
│  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
│  [This key is safe to use in a browser]
│
└─ service_role secret  ⚠️ Keep this key secret!
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   [This key has the ability to bypass Row Level Security]
```

**For Backend (Railway)**, copy the **`service_role`** key:
- This key can bypass RLS (Row Level Security)
- Needed for backend to upload files
- **⚠️ NEVER commit this to Git!**
- **⚠️ Only store in Railway environment variables**

**Copy the long JWT token** starting with `eyJ...`

---

### Step 4: Summary of Storage Credentials

You should now have:

```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```

**You'll add these to Railway in Phase 2.**

---

## 🚀 **USING CREDENTIALS IN RAILWAY**

### For Phase 1 (Database):

1. Go to: **https://railway.app**
2. Select your **FlipCars Backend** service
3. Click **"Variables"** tab
4. Find or create variable: **`DATABASE_URL`**
5. Paste the complete PostgreSQL connection string from Step 6 above
6. Click **"Add"** or **"Save"**
7. Click **"Redeploy"** button

---

### For Phase 2 (Storage):

After Phase 1 is complete and working:

1. In Railway Variables tab
2. Click **"+ New Variable"**
3. Add:
   - Name: `SUPABASE_URL`
   - Value: (paste from Step 2 above)
4. Click **"+ New Variable"** again
5. Add:
   - Name: `SUPABASE_SERVICE_KEY`
   - Value: (paste service_role key from Step 3 above)
6. Click **"Add"** or **"Save"**
7. Click **"Redeploy"** button

---

## ⚠️ **SECURITY CHECKLIST**

### Before Adding to Railway:
- [ ] Verified you're using **"My Truck Admin"** credentials (not wrong project)
- [ ] Checked DATABASE_URL contains **`us-east-2`** (not us-east-1)
- [ ] Password is actual password (not `[YOUR-PASSWORD]` placeholder)
- [ ] SUPABASE_SERVICE_KEY is the `service_role` key (not anon key)
- [ ] No extra spaces or line breaks in credentials
- [ ] Ready to paste into Railway Variables (not committing to Git!)

---

## 🔍 **VERIFICATION**

### How to Verify You Have the Right Credentials:

#### Database URL Check:
```bash
# Should contain us-east-2
echo $DATABASE_URL | grep "us-east-2"

# Should return something like:
# aws-0-us-east-2.pooler.supabase.com
```

#### Supabase URL Check:
```bash
# Should match your project URL
curl https://xxxxxxxxxxxxx.supabase.co/rest/v1/
# Should return: {"message":"The resource you requested could not be found."} (this is OK)
```

#### Service Key Check:
```bash
# Should start with eyJ
echo $SUPABASE_SERVICE_KEY | head -c 10
# Should output: eyJhbGciOi
```

---

## 🎯 **COMMON MISTAKES TO AVOID**

### ❌ Wrong Project
```
Using credentials from "Flipcars-site-e-admin" instead of "My Truck Admin"
→ Result: Still connecting to wrong database!
```

### ❌ Wrong Region
```
DATABASE_URL contains us-east-1 instead of us-east-2
→ Result: Wrong database, data goes to wrong place
```

### ❌ Forgot to Replace Password
```
DATABASE_URL still has [YOUR-PASSWORD] placeholder
→ Result: "Authentication failed" error
```

### ❌ Using Anon Key Instead of Service Role Key
```
Using anon public key for SUPABASE_SERVICE_KEY
→ Result: "Insufficient permissions" when uploading files
```

### ❌ Extra Spaces or Line Breaks
```
Credentials have whitespace from copy/paste
→ Result: Connection fails with cryptic errors
```

---

## 📞 **TROUBLESHOOTING**

### Can't Find "My Truck Admin" Project
- Log out and log back in to Supabase
- Check you're logged into correct Supabase account
- Verify project wasn't deleted or renamed

### Connection String Shows [YOUR-PASSWORD]
- You need to reset the database password
- Go to Settings → Database → "Reset Database Password"
- Copy the new password shown (you won't see it again!)

### Don't Know Which Key is Service Role
- Look for text: **"service_role secret ⚠️ Keep this key secret!"**
- It's the longer key with the warning about bypassing RLS
- Usually the second key shown (below "anon public")

### Password Reset Broke Existing Connections
- This is normal when resetting password
- Update Railway DATABASE_URL with new password
- Redeploy Railway
- Connections will work again

---

## ✅ **FINAL CHECKLIST**

Before proceeding to use these credentials:

### Phase 1 Credentials:
- [ ] Got DATABASE_URL from "My Truck Admin" project
- [ ] URL contains `us-east-2` region
- [ ] Replaced `[YOUR-PASSWORD]` with actual password
- [ ] No extra spaces or line breaks
- [ ] Ready to paste into Railway

### Phase 2 Credentials:
- [ ] Got SUPABASE_URL from "My Truck Admin" project
- [ ] Got SUPABASE_SERVICE_KEY (service_role, not anon)
- [ ] Verified keys start with `eyJ...`
- [ ] Ready to add to Railway (NOT committing to Git!)

---

## 🎓 **UNDERSTANDING WHAT EACH CREDENTIAL DOES**

### DATABASE_URL
```
Purpose: Connects backend to PostgreSQL database
Used by: TypeORM in NestJS backend
Allows: Read/write database tables (leads, users, etc.)
Scope: Database only
```

### SUPABASE_URL
```
Purpose: Identifies which Supabase project to connect to
Used by: Supabase client library
Allows: API calls to Supabase services
Scope: Project-level identifier
```

### SUPABASE_SERVICE_KEY
```
Purpose: Authenticates backend with full admin privileges
Used by: Supabase client in backend
Allows: Upload files, bypass RLS, full database access
Scope: Admin/service-level access (KEEP SECRET!)
```

---

## 🚀 **READY TO PROCEED?**

Once you have all credentials:

1. ✅ Go to `QUICK_FIX_CHECKLIST.md`
2. ✅ Start **Phase 1: Fix Database Connection**
3. ✅ Use DATABASE_URL from this guide
4. ✅ Update Railway and test
5. ✅ After Phase 1 works, proceed to **Phase 2**
6. ✅ Use SUPABASE_URL and SUPABASE_SERVICE_KEY from this guide

---

**You've got all the info you need!** 💪

**Follow the checklists and you'll have everything working!** 🎉

---

## 📚 **RELATED DOCUMENTATION**

- **Action Plan**: `QUICK_FIX_CHECKLIST.md`
- **Database Fix**: `FIX_DATABASE_CONFIG_GUIDE.md`
- **Storage Implementation**: `SUPABASE_STORAGE_IMPLEMENTATION.md`
- **Architecture Diagram**: `DATABASE_ARCHITECTURE_FIX.md`
- **Today's Summary**: `SUMMARY_2024-11-10.md`

**All documentation is in the project root directory.** ✅
