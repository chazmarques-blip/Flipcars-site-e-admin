# 🚀 Deployment Guide: Contact Preferences Feature

## 📋 Overview

This guide walks you through deploying the Contact Preferences feature to production.

## ⚠️ Prerequisites

Before deploying, ensure:
- [ ] Pull Request #14 has been reviewed and approved
- [ ] All CI/CD checks pass
- [ ] You have access to the production database (Railway/Supabase)
- [ ] You have verified the feature works in development/staging

---

## 📝 Step-by-Step Deployment

### Step 1: Merge Pull Request

1. **Go to GitHub**
   - URL: https://github.com/chazmarques-blip/Flipcars-site-e-admin/pull/14

2. **Review Changes**
   - Review the 4 changed files:
     - `backend/src/database/entities/lead.entity.ts`
     - `backend/src/database/migrations/1731538800000-AddContactPreferencesToLeads.ts`
     - `frontend-admin/src/app/dashboard/leads/page.tsx`
     - `frontend-admin/src/types/lead.ts`

3. **Merge to Main**
   - Click "Merge pull request"
   - Select "Squash and merge" (recommended)
   - Confirm the merge

---

### Step 2: Run Database Migration

#### Option A: Using Railway CLI

```bash
# 1. Install Railway CLI (if not already installed)
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Link to your project
railway link

# 4. Run migration
railway run npm run migration:run
```

#### Option B: Using Railway Dashboard

```bash
# 1. Go to Railway Dashboard
# 2. Select your backend service
# 3. Go to "Deploy" tab
# 4. Add a one-off command:
npm run migration:run

# 5. Click "Deploy" to run the migration
```

#### Option C: Using Supabase (If using Supabase instead of Railway)

```sql
-- 1. Go to Supabase Dashboard
-- 2. Navigate to SQL Editor
-- 3. Run this SQL command:

ALTER TABLE "leads" 
ADD COLUMN "contact_preferences" jsonb NULL;
```

#### Option D: Direct Database Access

```bash
# If you have direct PostgreSQL access

# 1. Connect to database
psql $DATABASE_URL

# 2. Run migration SQL
ALTER TABLE "leads" 
ADD COLUMN "contact_preferences" jsonb NULL;

# 3. Verify column was added
\d leads
```

---

### Step 3: Verify Migration Success

Check that the migration completed successfully:

```sql
-- Query to check if column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leads' 
  AND column_name = 'contact_preferences';

-- Expected output:
-- column_name           | data_type
-- ----------------------|----------
-- contact_preferences   | jsonb
```

---

### Step 4: Deploy Backend

#### If using Railway:

Railway will automatically deploy when you merge to main.

1. **Monitor Deployment**
   - Go to Railway Dashboard
   - Check deployment logs
   - Ensure deployment succeeds

2. **Verify Backend is Running**
   ```bash
   curl https://your-backend-url.railway.app/health
   ```

#### If using another platform:

Follow your platform's deployment process to deploy the latest main branch.

---

### Step 5: Deploy Frontend-Admin

#### If using Vercel:

Vercel will automatically deploy when you merge to main.

1. **Monitor Deployment**
   - Go to Vercel Dashboard
   - Check deployment status
   - Wait for "Ready" status

2. **Verify Deployment**
   - URL: https://admin.flipcars.us (or your admin URL)
   - Deployment should complete within 2-3 minutes

---

### Step 6: Post-Deployment Verification

#### 6.1 Test Backend API

```bash
# Test that the API accepts contactPreferences
curl -X POST https://api.flipcars.us/leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test User",
    "phone": "+1234567890",
    "email": "test@example.com",
    "contactPreferences": {
      "phoneCall": true,
      "whatsapp": false,
      "textMessage": true
    }
  }'
```

#### 6.2 Test Frontend-Admin

1. **Log into Admin Dashboard**
   - URL: https://admin.flipcars.us
   - Use your admin credentials

2. **Navigate to Leads Page**
   - Click "Leads" in sidebar

3. **Check for New Column**
   - ✅ "Preferred Contact" column should be visible
   - ✅ Should be positioned after "Contact" column
   - ✅ Legacy leads should show `—`

4. **Test with New Lead**
   - Go to public site: https://www.flipcars.us
   - Submit a new estimate form
   - In Step 4, select contact preferences (e.g., Phone Call + WhatsApp)
   - Complete the form submission
   - Return to admin dashboard
   - Find the new lead
   - ✅ Verify icons appear correctly in "Preferred Contact" column

---

### Step 7: Monitor for Issues

#### For the first 24 hours after deployment:

1. **Watch Error Logs**
   ```bash
   # Railway
   railway logs --service backend
   
   # Or check in dashboard
   ```

2. **Check for Common Issues**
   - [ ] Database connection errors
   - [ ] Migration rollback needed
   - [ ] Frontend display issues
   - [ ] API errors related to contactPreferences field

3. **Monitor User Feedback**
   - Check support channels
   - Look for reports of missing/broken features
   - Verify team can see contact preferences

---

## 🔄 Rollback Plan (If Needed)

If something goes wrong, follow these steps to rollback:

### Step 1: Revert Database Migration

```sql
-- Remove the contact_preferences column
ALTER TABLE "leads" 
DROP COLUMN "contact_preferences";
```

Or using TypeORM:

```bash
# Revert migration
npm run migration:revert
```

### Step 2: Revert Code Changes

```bash
# 1. Create a revert commit
git revert <commit-hash-of-feature>

# 2. Push to main
git push origin main

# 3. Deployments will automatically trigger
```

### Step 3: Verify Rollback

- [ ] Leads table no longer shows "Preferred Contact" column
- [ ] No errors in admin dashboard
- [ ] Existing functionality still works

---

## 📊 Success Metrics

After deployment, track these metrics:

### Immediate (First 24 hours)
- [ ] Zero deployment errors
- [ ] Zero database migration errors
- [ ] Admin team can see the new column
- [ ] New leads display icons correctly

### Short-term (First Week)
- [ ] All new leads have contact preferences populated
- [ ] Team is using contact preferences to reach customers
- [ ] No user complaints about the feature
- [ ] Response rates improve (due to using preferred methods)

### Long-term (First Month)
- [ ] Analyze which contact methods are most preferred
- [ ] Track if customer satisfaction improves
- [ ] Measure faster response times
- [ ] Plan future enhancements based on data

---

## 🐛 Troubleshooting

### Issue: Column not appearing in admin dashboard

**Solution:**
1. Clear browser cache (Ctrl+Shift+Del or Cmd+Shift+Del)
2. Hard refresh (Ctrl+F5 or Cmd+Shift+R)
3. Check if frontend deployed successfully in Vercel
4. Verify no JavaScript errors in browser console (F12)

---

### Issue: Icons not displaying

**Solution:**
1. Check that Lucide React icons are imported correctly
2. Verify Tailwind CSS classes are working
3. Check browser console for icon loading errors
4. Ensure `lucide-react` package is installed in `frontend-admin`

---

### Issue: Legacy leads showing errors instead of `—`

**Solution:**
1. Check that null/undefined handling is correct in code:
   ```typescript
   if (!prefs || (!prefs.phoneCall && !prefs.whatsapp && !prefs.textMessage)) {
     return <span className="text-xs text-gray-400">—</span>;
   }
   ```
2. Verify database column allows NULL values
3. Check backend API doesn't return undefined for old leads

---

### Issue: Database migration fails

**Solution:**
1. Check if column already exists:
   ```sql
   SELECT * FROM information_schema.columns 
   WHERE table_name = 'leads' AND column_name = 'contact_preferences';
   ```
2. If column exists, manually mark migration as run:
   ```sql
   INSERT INTO migrations (timestamp, name) 
   VALUES (1731538800000, 'AddContactPreferencesToLeads1731538800000');
   ```
3. If column doesn't exist, try running SQL manually

---

### Issue: New leads not showing contact preferences

**Solution:**
1. Check that frontend-public is sending the data:
   - Open browser dev tools (F12)
   - Submit a test form
   - Check Network tab for the POST request
   - Verify `contactPreferences` is in the request payload
2. Check backend is saving the data:
   - Query the database directly
   - Verify `contact_preferences` column is populated
3. Check frontend-admin is reading the data:
   - Check API response in Network tab
   - Verify `contactPreferences` is in the response

---

## 📞 Emergency Contacts

If you encounter issues during deployment:

- **Primary Developer**: GenSpark AI Developer
- **Database Admin**: [Your DB Admin]
- **DevOps Lead**: [Your DevOps Lead]
- **Product Owner**: [Your Product Owner]

---

## ✅ Post-Deployment Checklist

Mark these off after deployment:

### Immediate (Within 1 hour)
- [ ] Database migration completed successfully
- [ ] Backend deployed and running
- [ ] Frontend-admin deployed and running
- [ ] "Preferred Contact" column visible in leads table
- [ ] No console errors in browser
- [ ] No server errors in logs

### Same Day
- [ ] Submitted test lead from public site
- [ ] Verified icons appear correctly for test lead
- [ ] Tested all contact preference combinations
- [ ] Notified team about new feature
- [ ] Updated team documentation/wiki

### Next Day
- [ ] Checked error logs (zero errors related to feature)
- [ ] Verified multiple new leads display correctly
- [ ] Confirmed team is using the feature
- [ ] Gathered initial feedback from team

### End of Week
- [ ] Feature is stable (no bugs reported)
- [ ] Team training completed
- [ ] Analytics show feature adoption
- [ ] Plan next iteration based on feedback

---

## 🎓 Training the Team

After deployment, train your team:

1. **Send announcement email** with links to documentation:
   - `CONTACT_PREFERENCES_FEATURE.md`
   - `CONTACT_PREFERENCES_VISUAL_GUIDE.md`

2. **Hold 15-minute demo session**:
   - Show the new column
   - Explain icon meanings
   - Demonstrate tooltip hover
   - Practice using preferences to contact leads

3. **Create quick reference card**:
   - Print `CONTACT_PREFERENCES_VISUAL_GUIDE.md` last section
   - Post near workstations

4. **Set up feedback channel**:
   - Slack channel or email
   - Gather suggestions for improvements

---

## 📈 Next Steps

After successful deployment, consider:

1. **Feature Enhancements**
   - Add filtering by contact preference
   - Export contact preferences in lead exports
   - Display in lead detail view
   - Add analytics dashboard for preference trends

2. **Process Improvements**
   - Update SOP to always check contact preferences first
   - Train new hires on using the feature
   - Create metrics around contact method effectiveness

3. **Technical Improvements**
   - Add unit tests for contact preferences display
   - Add E2E tests for the feature
   - Optimize database queries if needed

---

**Deployment Date**: _______________  
**Deployed By**: _______________  
**Status**: ⬜ Pending / ⬜ In Progress / ⬜ Complete  
**Issues Found**: _______________

---

**Last Updated**: 2025-11-13  
**Feature**: Contact Preferences Column  
**PR**: #14
