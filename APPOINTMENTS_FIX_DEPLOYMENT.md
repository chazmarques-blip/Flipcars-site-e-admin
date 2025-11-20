# 🔧 Appointments Fix - Deployment Guide

## Problem
Appointments disappeared from the calendar after production deployment.

## Root Cause
The `USE_TEST_DATA` flag was set to `true` in `/frontend-admin/src/lib/mockData/testAppointments.ts`, causing the calendar components to use test data instead of fetching real appointments from the backend API.

## Solution Applied
Changed `USE_TEST_DATA = true` to `USE_TEST_DATA = false` to enable real data fetching.

## Files Changed
- ✅ `frontend-admin/src/lib/mockData/testAppointments.ts` (line 211)

## Components Affected
The following components now fetch real data from the backend:
1. `CalendarGrid.tsx` - Main calendar grid display
2. `CalendarSidebar.tsx` - Overdue and upcoming appointments sidebar
3. `CalendarStats.tsx` - Dashboard statistics (total, today, this week, etc.)

---

## 🚀 Deployment Steps

### Option 1: Merge PR and Redeploy (Recommended)

1. **Merge Pull Request #30** on GitHub
   ```bash
   # On GitHub, navigate to Pull Request #30 and click "Merge Pull Request"
   ```

2. **Pull latest changes to production server**
   ```bash
   cd /path/to/flipcars-production
   git checkout main
   git pull origin main
   ```

3. **Rebuild frontend**
   ```bash
   cd frontend-admin
   npm install  # If dependencies changed
   npm run build
   ```

4. **Restart the frontend service**
   ```bash
   # If using PM2:
   pm2 restart flipcars-admin
   
   # If using systemd:
   sudo systemctl restart flipcars-admin
   
   # If using Docker:
   docker-compose restart frontend-admin
   ```

### Option 2: Quick Fix (Cherry-pick single commit)

If you want to deploy just this fix without merging the entire PR:

1. **On production server, cherry-pick the fix commit**
   ```bash
   cd /path/to/flipcars-production
   git checkout main
   git cherry-pick 457738ee
   ```

2. **Rebuild and restart** (same as Option 1 steps 3-4)

---

## ✅ Verification Steps

After deployment, verify the fix:

1. **Open the appointments calendar**
   - Navigate to `https://your-production-domain.com/dashboard/appointments`

2. **Check that appointments are visible**
   - You should see appointment indicators (golden bars) on calendar days
   - The count badges should show the number of appointments per day
   - Sidebar should show overdue and upcoming appointments

3. **Check browser console**
   - Press F12 to open DevTools
   - Go to Console tab
   - Look for `[CalendarGrid]` logs confirming API calls:
     ```
     [CalendarGrid] Fetching appointments for 2025-11
     [CalendarGrid] ✅ Fetched X appointments
     ```

4. **Verify API is working**
   - Check Network tab in DevTools
   - Look for successful API calls to `/appointments/month/{year}/{month}`
   - Status should be `200 OK`

---

## 🔍 Troubleshooting

### If appointments still don't appear:

1. **Check backend is running**
   ```bash
   curl http://localhost:3000/health
   # Should return: {"status":"ok"}
   ```

2. **Check appointments exist in database**
   ```bash
   # From backend directory
   npm run prisma:studio
   # Navigate to Appointment table and verify records exist
   ```

3. **Check API endpoint manually**
   ```bash
   # Replace {year} and {month} with current values
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        http://localhost:3000/appointments/month/2025/11
   ```

4. **Check frontend environment variables**
   - Verify `NEXT_PUBLIC_API_URL` is set correctly in `.env.local`
   - Should point to your backend API (e.g., `http://localhost:3000`)

5. **Clear browser cache**
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   - Or clear cache in DevTools: Network tab → Disable cache (checkbox)

---

## 📝 Additional Notes

### Why did this happen?
The `USE_TEST_DATA` flag was likely left as `true` during development/testing and wasn't changed before the last production deployment.

### Prevention
Consider adding an environment-based check:
```typescript
// In testAppointments.ts
export const USE_TEST_DATA = process.env.NODE_ENV === 'development' && 
                             process.env.NEXT_PUBLIC_USE_TEST_DATA === 'true';
```

This way, test data is only used in development when explicitly enabled.

---

## 🔗 Related Resources

- **Pull Request**: #30 on GitHub
- **Commits**: 
  - Fix commit: `457738ee` - "fix: disable test data flag to show real appointments in production"
  - Previous commit: `46e71984` - "feat: translate Portuguese to English, reduce spacing in mockup"
- **Troubleshooting Guide**: See `APPOINTMENTS_TROUBLESHOOTING.md` for detailed debugging steps

---

## 📞 Support

If you encounter any issues during deployment:

1. Check the browser console for error messages
2. Check backend logs for API errors
3. Verify database connectivity
4. Ensure all environment variables are set correctly

The appointments should appear immediately after redeploying with the fix applied. No database migrations or additional configuration changes are needed.
