# 📞 Contact Preferences Feature Implementation

## 📋 Overview

This document describes the implementation of the **Contact Preferences Column** in the admin leads table. This feature allows administrators to see at a glance how each customer prefers to be contacted based on their selections in the estimate form.

## ✨ Feature Description

The admin dashboard now displays a new "Preferred Contact" column that shows visual icons representing the customer's contact preferences:

- 📞 **Phone Call** - Blue phone icon (Phone)
- 💬 **WhatsApp** - Green message circle icon (MessageCircle)
- 💭 **Text Message** - Purple message square icon (MessageSquare)

### Visual Appearance

```
| Customer     | Contact       | Preferred Contact |
|--------------|---------------|-------------------|
| Jorge Cova   | (407)773-4679 | 📞 💬 💭          |
| Charles      | (727)459-2135 | 📞                |
| Felipe       | (321)566-8494 | 💬                |
| Mario        | (689)296-1051 | 💭                |
```

## 🔧 Technical Implementation

### 1. Backend Changes

#### Lead Entity (`backend/src/database/entities/lead.entity.ts`)

Added new field to store contact preferences:

```typescript
// Contact Preferences
@Column({ type: 'jsonb', nullable: true, name: 'contact_preferences' })
contactPreferences: {
  phoneCall?: boolean;
  whatsapp?: boolean;
  textMessage?: boolean;
};
```

#### Database Migration

Created migration file: `backend/src/database/migrations/1731538800000-AddContactPreferencesToLeads.ts`

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "leads" 
        ADD COLUMN "contact_preferences" jsonb NULL
    `);
}
```

### 2. Frontend-Admin Changes

#### Lead Type Interface (`frontend-admin/src/types/lead.ts`)

Added contact preferences to the Lead interface:

```typescript
export interface Lead {
  // ... existing fields
  
  // Contact preferences
  contactPreferences?: {
    phoneCall?: boolean;
    whatsapp?: boolean;
    textMessage?: boolean;
  };
  
  // ... other fields
}
```

#### Leads Table Page (`frontend-admin/src/app/dashboard/leads/page.tsx`)

Added new column to the data table:

```typescript
import { Phone, MessageCircle, MessageSquare } from 'lucide-react';

// ... in columns array

{
  key: 'contactPreferences',
  label: 'Preferred Contact',
  render: (lead) => {
    const prefs = lead.contactPreferences;
    if (!prefs || (!prefs.phoneCall && !prefs.whatsapp && !prefs.textMessage)) {
      return <span className="text-xs text-gray-400">—</span>;
    }
    
    return (
      <div className="flex items-center gap-1">
        {prefs.phoneCall && (
          <div 
            className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700"
            title="Phone Call"
          >
            <Phone className="w-3 h-3" />
          </div>
        )}
        {prefs.whatsapp && (
          <div 
            className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700"
            title="WhatsApp"
          >
            <MessageCircle className="w-3 h-3" />
          </div>
        )}
        {prefs.textMessage && (
          <div 
            className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-700"
            title="Text Message"
          >
            <MessageSquare className="w-3 h-3" />
          </div>
        )}
      </div>
    );
  },
},
```

## 📝 How It Works

### Data Flow

1. **Customer Submission** (Frontend-Public)
   - Customer fills out the estimate form
   - In Step 4, they select their preferred contact methods (can select multiple)
   - Data is submitted with `contactPreferences` object:
     ```json
     {
       "contactPreferences": {
         "phoneCall": true,
         "whatsapp": true,
         "textMessage": false
       }
     }
     ```

2. **Data Storage** (Backend)
   - Backend receives the lead data
   - Stores `contactPreferences` in the `contact_preferences` JSONB column
   - TypeORM automatically handles the JSON serialization

3. **Display** (Frontend-Admin)
   - Admin views the leads table
   - For each lead, the component reads `contactPreferences`
   - Renders appropriate icons based on the boolean values
   - Shows tooltips on hover for accessibility

## 🎨 Design Decisions

### Color Coding
- **Blue** for Phone Calls - Traditional phone/call association
- **Green** for WhatsApp - Matches WhatsApp brand color
- **Purple** for Text Messages - Distinctive color that stands out

### Icon Choices (Lucide React)
- `Phone` - Universal phone symbol
- `MessageCircle` - WhatsApp-like messaging icon
- `MessageSquare` - SMS/text message symbol

### Fallback Handling
- Displays `—` (em dash) for leads without contact preferences
- Gracefully handles null/undefined values
- Compatible with existing leads that don't have this field

## 🧪 Testing

### Manual Testing Steps

1. **Database Migration**
   ```bash
   cd backend
   npm run migration:run
   ```

2. **Submit Test Lead**
   - Go to https://www.flipcars.us
   - Click "Free Estimate"
   - Fill out the form through all steps
   - In Step 4, select different combinations of contact preferences
   - Submit the form

3. **Verify in Admin Dashboard**
   - Log in to admin dashboard
   - Navigate to Leads page
   - Check that the "Preferred Contact" column displays the correct icons
   - Hover over icons to see tooltips

### Test Cases

| Test Case | Contact Prefs Selected | Expected Display |
|-----------|------------------------|------------------|
| All three | Call + WhatsApp + Text | 📞 💬 💭 |
| Call only | Call | 📞 |
| WhatsApp only | WhatsApp | 💬 |
| Text only | Text | 💭 |
| Call + WhatsApp | Call + WhatsApp | 📞 💬 |
| Call + Text | Call + Text | 📞 💭 |
| WhatsApp + Text | WhatsApp + Text | 💬 💭 |
| None (old leads) | N/A | — |

## 🔄 Data Migration

### Existing Leads
- Existing leads in the database will have `contact_preferences` as `NULL`
- The UI handles this gracefully by displaying `—`
- No data migration needed for existing records
- New leads will automatically populate this field

### Rollback
If needed to rollback:
```bash
cd backend
npm run migration:revert
```

This will remove the `contact_preferences` column from the database.

## 📊 Database Schema

```sql
-- New column in leads table
ALTER TABLE "leads" 
ADD COLUMN "contact_preferences" jsonb NULL;

-- Example data structure
{
  "phoneCall": true,
  "whatsapp": false,
  "textMessage": true
}
```

## 🚀 Deployment

### Production Deployment Steps

1. **Merge Pull Request**
   - PR #14: https://github.com/chazmarques-blip/Flipcars-site-e-admin/pull/14
   - Review and approve the changes
   - Merge to main branch

2. **Run Database Migration**
   ```bash
   # SSH into production server or use Railway/Supabase dashboard
   npm run migration:run
   ```

3. **Deploy Frontend-Admin**
   - Vercel will automatically deploy when main branch is updated
   - Or manually trigger deployment

4. **Verify**
   - Check admin dashboard displays correctly
   - Test with a new lead submission
   - Confirm icons appear as expected

## 📚 Related Files

### Backend
- `backend/src/database/entities/lead.entity.ts` - Entity definition
- `backend/src/database/migrations/1731538800000-AddContactPreferencesToLeads.ts` - Migration

### Frontend-Admin
- `frontend-admin/src/types/lead.ts` - Type definitions
- `frontend-admin/src/app/dashboard/leads/page.tsx` - Leads table UI

### Frontend-Public (Reference)
- `frontend-public/src/components/estimate/Step4Contact.tsx` - Form where users select preferences
- `frontend-public/src/types/estimate.ts` - ContactPreferences interface

## 🐛 Known Issues

None at this time.

## 🔮 Future Enhancements

Possible future improvements:
1. Add filtering by contact preference in the leads table
2. Export contact preferences in lead exports
3. Display contact preferences in lead detail view
4. Analytics on most common contact preferences
5. Bulk actions based on contact preferences (e.g., "Send WhatsApp to all WhatsApp-preferring leads")

## 📞 Support

For questions or issues, contact the development team or refer to the main project documentation.

---

**Last Updated**: 2025-11-13  
**Author**: GenSpark AI Developer  
**PR**: #14
