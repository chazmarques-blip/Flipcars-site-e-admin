# Lead Not Found Investigation - FL-2025-1175

## Current Situation

**User Submitted Form**: Carlos via flipcars.us/estimate
**Confirmation Showed**: FL-2025-1175
**Admin Dashboard**: Lead NOT found when searching for FL-2025-1175
**Railway Logs**: Show "Lead created successfully: FLIP" at 9:23:17 AM EST (level 1016)

## Root Cause Analysis

### The Reference Number Discrepancy

**Frontend Code** (`EstimateForm.tsx`):
- Line 43: `setReferenceNumber(response.data.referenceNumber)` - Uses backend response (CORRECT)
- Line 68-69: **FALLBACK CODE** - Generates `FL-YYYY-NNNN` format when API fails

```typescript
// FALLBACK CODE (only executes if API fails)
const refNumber = `FL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
setReferenceNumber(refNumber);
```

**Backend Code** (`public-leads.controller.ts`):
- Generates format: `FLIP-YYYYMMDD-XXXX`
- Example from our test: `FLIP-20251109-0016`
- Railway logs confirm: "Lead created successfully: FLIP"

### What Actually Happened

The evidence suggests:

1. ✅ **Backend succeeded** - Railway logs show lead creation at 9:23:17 AM EST
2. ❌ **Frontend used fallback** - Showed FL-2025-1175 instead of backend reference
3. 🔍 **Likely cause**: CORS error, network timeout, or response parsing issue

The lead DOES exist in the database, but with a different reference number!

## Backend Reference Number Format

The backend generates:
```
FLIP-YYYYMMDD-XXXX
```

Where:
- `FLIP` = Prefix
- `YYYYMMDD` = Date (20251109 for Nov 9, 2025)
- `XXXX` = Sequential counter (0001, 0002, etc.)

Example: `FLIP-20251109-0016`

## How to Find the Lead

### Option 1: Search by Name (RECOMMENDED)
Search in admin dashboard for: **"Carlos"**

### Option 2: Check Backend Logs
Railway logs should show the complete reference number:
```
Lead created successfully: FLIP-20251109-XXXX
```

### Option 3: Search by Today's Date Pattern
Search for leads with pattern: `FLIP-20251109-*`

### Option 4: Check Latest Leads
Sort leads by creation date (newest first) and look for:
- Name: Carlos
- Email: (user's email)
- Date: Today (Nov 9, 2025)
- Time: Around 9:23 AM EST

## Verification Steps

To confirm what happened, check browser DevTools:

### 1. Network Tab
- Find the POST request to `/api/public/leads`
- Check Status Code:
  - 201 = Success (backend received it)
  - 0, 4xx, 5xx = Error
- View Response body to see actual reference number
- Check for CORS errors in response

### 2. Console Tab
Look for these log messages:
```
[ApiClient] Initializing with API_URL: ...
[LeadsService] Creating lead via public endpoint: ...
[LeadsService] ✅ Lead created successfully: ...
[EstimateForm] ✅ Lead created successfully: ...
```

OR error messages:
```
[LeadsService] ❌ Error creating lead: ...
[EstimateForm] ❌ Error submitting to backend: ...
[EstimateForm] ⚠️ Saved to localStorage (pending sync): ...
```

## Possible Issues

### 1. CORS Error (Most Likely)
**Symptom**: Request reaches backend (logs show success), but frontend can't read response

**Solution**: Verify CORS is configured correctly in `backend/src/main.ts`:
```typescript
const defaultOrigins = [
  'https://flipcars.us',
  'https://www.flipcars.us',
  'https://admin.flipcars.us',
];
```

### 2. Network Timeout
**Symptom**: Request takes too long, axios timeout triggered (30s)

**Solution**: Check backend performance, database queries

### 3. Response Structure Mismatch
**Symptom**: Backend returns data in unexpected format

**Solution**: Verify backend response matches:
```typescript
{
  success: true,
  message: "Lead created successfully",
  data: {
    referenceNumber: "FLIP-20251109-XXXX",
    name: "...",
    email: "...",
    // ...
  }
}
```

## Immediate Action Plan

1. **Find the Lead**:
   - Search admin dashboard for "Carlos"
   - Check leads created today around 9:23 AM EST
   - Look for reference starting with `FLIP-20251109-`

2. **Verify the Issue**:
   - Open DevTools Console tab
   - Resubmit the form (or check cached logs)
   - Identify exact error that triggered fallback

3. **Fix CORS if Needed**:
   - If CORS error found, verify Railway deployment has correct CORS config
   - Check that `flipcars.us` (without www) is in allowed origins

4. **Test Again**:
   - Submit another test form
   - Verify frontend shows FLIP-YYYYMMDD-XXXX format
   - Confirm lead appears in admin dashboard immediately

## Expected Outcome

After fixing, the flow should be:

1. User submits form at flipcars.us/estimate
2. Frontend calls `/api/public/leads`
3. Backend creates lead with reference `FLIP-20251109-XXXX`
4. Backend responds with 201 and reference number
5. Frontend displays FLIP-20251109-XXXX on confirmation
6. Lead immediately searchable in admin dashboard
7. Searching for FLIP-20251109-XXXX returns the lead

## Related Files

- `frontend-public/src/components/estimate/EstimateForm.tsx` - Form submission logic
- `frontend-public/src/lib/api/leads.service.ts` - API service
- `backend/src/modules/leads/public-leads.controller.ts` - Public endpoint
- `backend/src/main.ts` - CORS configuration
- Railway logs - Backend execution logs

---

**Next Step**: Search for "Carlos" in admin dashboard to find the actual lead.
