# Calendar API Integration - Debugging Guide

## 🎯 Current Status

**Issue Reported:** Modals not opening in `/dashboard/appointments-v2` (production)

**Actual Behavior:** Modal DOES open, but shows "No events scheduled" for November 15, 2025

**Root Cause:** The `window.eventsByDate` object is empty, meaning either:
1. No appointments exist in database for November 2025
2. API call is failing silently
3. Authentication token is missing/invalid
4. Data transformation is failing

---

## 🔧 Changes Made

### Enhanced Debugging in `calendar-with-api.js`

Added comprehensive logging to diagnose the issue:

#### 1. Token Detection
```javascript
console.log('Available localStorage keys:', Object.keys(localStorage));
console.log('✅ Found auth token:', token.substring(0, 20) + '...');
```

#### 2. API Request Logging
```javascript
console.log('📡 Calling API:', apiUrl);
console.log('📡 API Response status:', response.status, response.statusText);
```

#### 3. Data Transformation Logging
```javascript
console.log('📋 Appointments data:', appointments);
appointments.forEach((apt, index) => {
  console.log(`  Processing appointment ${index + 1}:`, { ... });
});
```

#### 4. Summary Logging
```javascript
console.log('📊 Events by date summary:');
Object.keys(window.eventsByDate).forEach(date => {
  console.log(`  ${date}: ${window.eventsByDate[date].length} events`);
});
```

---

## 🔍 How to Debug in Production

### Step 1: Open Browser DevTools

1. Log in to https://admin.flipcars.us
2. Navigate to `/dashboard/appointments-v2`
3. Open Chrome DevTools (F12)
4. Go to **Console** tab

### Step 2: Look for These Log Messages

#### ✅ Success Case:
```
📅 Loading calendar-with-api.js...
✅ Initializing calendar with real API data...
📡 Loading calendar data for 2025-11...
✅ Found auth token: eyJhbGciOiJIUzI1NiIsI...
📡 Calling API: /api/appointments/month/2025/11
📡 API Response status: 200 OK
✅ Loaded 5 appointments from API
📋 Appointments data: [...]
🔄 Transforming appointments to calendar format...
  Processing appointment 1: {...}
  Processing appointment 2: {...}
✅ Transformed data - eventsByDate: {...}
📊 Events by date summary:
  2025-11-15: 3 events
  2025-11-17: 2 events
📅 Calendar rendered with real data
✅ Calendar loaded successfully!
```

#### ❌ No Token:
```
❌ No auth token found in localStorage
Available localStorage keys: ['theme', 'language']
❌ Authentication required
```

#### ❌ API Error:
```
📡 API Response status: 401 Unauthorized
❌ API error response: {"message":"Invalid token"}
❌ Error loading calendar data: API error: 401 - {"message":"Invalid token"}
```

#### ⚠️ No Data:
```
✅ Loaded 0 appointments from API
⚠️ No appointments returned from API
ℹ️ No appointments found for this month
```

---

## 🎯 Next Steps Based on Console Output

### Scenario 1: "No auth token found"
**Solution:** User needs to log out and log back in

### Scenario 2: "API error: 401"
**Solution:** Token expired or invalid - log out and log back in

### Scenario 3: "API error: 404"
**Solution:** Backend endpoint `/api/appointments/month/:year/:month` doesn't exist
- Check backend routes
- Verify API is deployed

### Scenario 4: "Loaded 0 appointments"
**Solution:** No appointments in database for November 2025
- Create test appointments
- Change month to one with existing appointments
- Use `/dashboard/mockup-exact` to test with fake data

### Scenario 5: "Loaded X appointments" but still shows "No events"
**Solution:** Date format mismatch
- Check `appointmentDate` format in API response (should be YYYY-MM-DD)
- Verify date transformation logic

---

## 🧪 Testing with Console

Once on the page, you can manually test:

```javascript
// Check if script loaded
console.log('eventsByDate:', window.eventsByDate);

// Check auth token
console.log('Token:', localStorage.getItem('auth_token') || localStorage.getItem('token'));

// Manually call API
fetch('/api/appointments/month/2025/11', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token') || localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log('Manual API call result:', data));

// Check specific date
console.log('Events on 2025-11-15:', window.eventsByDate['2025-11-15']);
```

---

## 📊 Expected API Response Format

The backend should return an array of appointments:

```json
[
  {
    "id": "uuid-here",
    "appointmentDate": "2025-11-15",
    "appointmentTimeSlot": "9:00-11:00",
    "status": "Scheduled",
    "lead": {
      "id": "lead-uuid",
      "name": "John Doe",
      "phone": "(555) 123-4567",
      "email": "john@example.com",
      "referenceNumber": "FLIP-20251115-0001",
      "vehicleYear": 2019,
      "vehicleMake": "Honda",
      "vehicleModel": "Civic",
      "serviceType": "Body Repair",
      "hasInsurance": true,
      "insuranceProvider": "State Farm",
      "estimatedValue": 1500
    }
  }
]
```

---

## 🚀 Deployment Status

**Changes committed:** ✅
**Pushed to main:** ✅
**Vercel auto-deploy:** In progress...

Once Vercel finishes deploying (usually 1-2 minutes), the new logging will be active in production.

---

## 📝 What to Share with Me

After checking the console in production, please share:

1. **All console logs** (copy/paste or screenshot)
2. **localStorage contents:** `Object.keys(localStorage)`
3. **Token exists?** Yes/No (don't share the actual token)
4. **Number of appointments loaded:** X appointments
5. **eventsByDate contents:** What dates have events?

This will help me quickly identify the exact issue!

---

## 🔗 Useful Links

- **Production URL:** https://admin.flipcars.us/dashboard/appointments-v2
- **Mockup (fake data):** https://admin.flipcars.us/dashboard/mockup-exact
- **Backend API docs:** (if available)
- **GitHub repo:** https://github.com/chazmarques-blip/Flipcars-site-e-admin

---

## 💡 Quick Wins

If you just want to see it working while we debug:

1. **Use mockup version:** `/dashboard/mockup-exact` - works with fake data
2. **Create test appointments:** Add appointments for November 2025 in the admin panel
3. **Try different month:** Click ◀/▶ to navigate to months with existing appointments

---

Generated on: 2025-11-17 01:09 UTC
Commit: 179e0f61
