# Insurance & Warranty Logos - Supabase Storage Implementation

## 📋 Summary

Updated the FlipCars estimate form to use company logos stored in Supabase Storage instead of local files. This improves performance, reliability, and makes logo management centralized.

## 🎯 Changes Implemented

### 1. **Removed "Auto-Owners" from Insurance Companies**
- Eliminated from `INSURANCE_COMPANIES` array in `/frontend-public/src/types/estimate.ts`
- Simplified the insurance selection interface

### 2. **Added Icons for Special Options**
- **Private (Self-Pay)**: Added Wallet icon from `lucide-react`
- **Other**: Added HelpCircle icon from `lucide-react`
- Both options now have visual identity instead of plain text

### 3. **"Other" Company Name Input**
- When user selects "Other", a text input field appears dynamically
- User can enter custom insurance/warranty company name
- Field is required when "Other" is selected
- Validates and stores as "Other: [Company Name]"

### 4. **Migrated Logos to Supabase Storage**

#### Created Supabase Bucket:
- Bucket name: `company-logos`
- Public access: Yes
- File size limit: 5MB
- Allowed formats: PNG, JPEG, JPG, WEBP, SVG

#### Insurance Company Logos Uploaded:
- ✅ Allstate
- ✅ American Family
- ✅ Erie Insurance
- ✅ Farmers Insurance
- ✅ Geico
- ✅ Liberty Mutual
- ✅ Nationwide
- ✅ Progressive
- ✅ State Farm
- ✅ Travelers
- ✅ USAA

#### Warranty Company Logos Uploaded:
- ✅ CARCHEX
- ✅ CarShield
- ✅ Endurance
- ✅ Protect My Car

## 📂 Files Modified

### `/frontend-public/src/types/estimate.ts`
```typescript
// Removed "Auto-Owners" from INSURANCE_COMPANIES array
export const INSURANCE_COMPANIES = [
  'Private (Self-Pay)',
  'Allstate',
  'American Family',
  // 'Auto-Owners', // REMOVED
  'Erie Insurance',
  'Farmers Insurance',
  'Geico',
  'Liberty Mutual',
  'Nationwide',
  'Progressive',
  'State Farm',
  'Travelers',
  'USAA',
  'Other',
] as const;
```

### `/frontend-public/src/components/estimate/Step2ServiceDetails.tsx`
```typescript
// Added new imports
import { Calendar, Info, Wallet, HelpCircle } from 'lucide-react';

// Updated logo maps to use Supabase URLs
const getInsuranceLogo = (company: string): string | null => {
  const logoMap: Record<string, string> = {
    'Allstate': 'https://kvjvieekkudeqtnunqlb.supabase.co/storage/v1/object/public/company-logos/insurance-allstate.png',
    // ... all other logos
  };
  return logoMap[company] || null;
};

const getWarrantyLogo = (company: string): string | null => {
  const logoMap: Record<string, string> = {
    'CARCHEX': 'https://kvjvieekkudeqtnunqlb.supabase.co/storage/v1/object/public/company-logos/warranty-carchex.png',
    // ... all other logos
  };
  return logoMap[company] || null;
};

// Added icons for "Private (Self-Pay)" and "Other"
// See component code for full implementation
```

## 🔧 Scripts Created

### `/scripts/check-supabase-buckets.js`
- Lists existing Supabase Storage buckets
- Creates `company-logos` bucket if it doesn't exist

### `/scripts/upload-logos-to-supabase.js`
- Uploads all insurance company logos to Supabase Storage
- Returns public URLs for each logo

### `/scripts/upload-warranty-logos.js`
- Uploads all warranty company logos to Supabase Storage
- Returns public URLs for each logo

## 🌐 Supabase Storage URLs

All logos are now accessible via:
```
https://kvjvieekkudeqtnunqlb.supabase.co/storage/v1/object/public/company-logos/[filename]
```

## ✅ Benefits

1. **Centralized Storage**: All logos in one place, easy to manage
2. **CDN Performance**: Supabase Storage provides CDN distribution
3. **Easy Updates**: Update logos without redeploying frontend
4. **Version Control**: Can update logos independently
5. **No Local Files**: Reduces frontend bundle size
6. **Public Access**: Direct public URLs, no authentication needed

## 🎨 UI Improvements

### Before:
- "Auto-Owners" option (removed)
- "Private (Self-Pay)" - plain text
- "Other" - plain text
- No input field for custom company names

### After:
- 💳 "Private (Self-Pay)" with Wallet icon
- ❓ "Other" with HelpCircle icon
- Dynamic text input when "Other" is selected
- All logos loaded from Supabase CDN
- Cleaner, more visual interface

## 📝 Testing

To test the changes:

1. Navigate to the estimate form
2. Select "Body Shop" or "Mechanic" service
3. In Step 2, verify:
   - All insurance/warranty logos display correctly
   - "Private (Self-Pay)" shows wallet icon
   - "Other" shows help circle icon
   - Clicking "Other" reveals text input field
   - Can enter custom company name in "Other" field
   - "Auto-Owners" is no longer in the list

## 🚀 Deployment Notes

- Frontend needs to be redeployed for changes to take effect
- Supabase Storage is already configured and public
- No backend changes required
- Logos are publicly accessible, no auth needed

## 📊 Logo URLs Reference

### Insurance Companies
```javascript
{
  'Allstate': 'https://kvjvieekkudeqtnunqlb.supabase.co/storage/v1/object/public/company-logos/insurance-allstate.png',
  'American Family': 'https://kvjvieekkudeqtnunqlb.supabase.co/storage/v1/object/public/company-logos/insurance-american-family.png',
  'Erie Insurance': 'https://kvjvieekkudeqtnunqlb.supabase.co/storage/v1/object/public/company-logos/insurance-erie.png',
  'Farmers Insurance': 'https://kvjvieekkudeqtnunqlb.supabase.co/storage/v1/object/public/company-logos/insurance-farmers.png',
  'Geico': 'https://kvjvieekkudeqtnunqlb.supabase.co/storage/v1/object/public/company-logos/insurance-geico.png',
  'Liberty Mutual': 'https://kvjvieekkudeqtnunqlb.supabase.co/storage/v1/object/public/company-logos/insurance-liberty-mutual.png',
  'Nationwide': 'https://kvjvieekkudeqtnunqlb.supabase.co/storage/v1/object/public/company-logos/insurance-nationwide.png',
  'Progressive': 'https://kvjvieekkudeqtnunqlb.supabase.co/storage/v1/object/public/company-logos/insurance-progressive.png',
  'State Farm': 'https://kvjvieekkudeqtnunqlb.supabase.co/storage/v1/object/public/company-logos/insurance-statefarm.png',
  'Travelers': 'https://kvjvieekkudeqtnunqlb.supabase.co/storage/v1/object/public/company-logos/insurance-travelers.png',
  'USAA': 'https://kvjvieekkudeqtnunqlb.supabase.co/storage/v1/object/public/company-logos/insurance-usaa.png',
}
```

### Warranty Companies
```javascript
{
  'CARCHEX': 'https://kvjvieekkudeqtnunqlb.supabase.co/storage/v1/object/public/company-logos/warranty-carchex.png',
  'CarShield': 'https://kvjvieekkudeqtnunqlb.supabase.co/storage/v1/object/public/company-logos/warranty-carshield.jpg',
  'Endurance': 'https://kvjvieekkudeqtnunqlb.supabase.co/storage/v1/object/public/company-logos/warranty-endurance.png',
  'Protect My Car': 'https://kvjvieekkudeqtnunqlb.supabase.co/storage/v1/object/public/company-logos/warranty-protect-my-car.png',
}
```

---

**Date**: 2025-11-12  
**Developer**: AI Assistant  
**Project**: FlipCars - Auto Body Shop Lead Management System
