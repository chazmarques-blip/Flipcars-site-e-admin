# 📋 Free Estimate Form - Complete Flow Design

**Purpose**: Capture lead information with minimal typing and maximum ease of use  
**Access**: Triggered by "Free Estimate" button on main site  
**Mobile-First**: Designed for easy mobile completion

---

## 🎨 **DESIGN PRINCIPLES**

1. ✅ **Minimal Typing**: Use selects, flags, and pre-filled options
2. ✅ **Clear Labels**: Descriptions inside fields (placeholders)
3. ✅ **Progressive Disclosure**: Show only relevant fields
4. ✅ **Mobile Optimized**: Large touch targets, easy scrolling
5. ✅ **Optional vs Required**: Clear visual distinction
6. ✅ **Smart Defaults**: Pre-select common options

---

## 📱 **FORM FLOW DIAGRAM**

### **STEP 1: Basic Information** (Always Shown)
```
┌─────────────────────────────────────────────────┐
│  📋 Free Estimate Request                       │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │ First Name *                              │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │ Last Name *                               │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │ Phone Number * (___) ___-____             │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │ Email Address *                           │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  What service do you need? *                    │
│  ┌─────────────────┐  ┌─────────────────┐     │
│  │  🚗 Body Shop   │  │  🔧 Mechanic    │     │
│  │  (selected)     │  │                 │     │
│  └─────────────────┘  └─────────────────┘     │
│                                                  │
│          [ Continue → ]                         │
└─────────────────────────────────────────────────┘

Required fields (*) - 5 fields
Toggle buttons for service type
```

---

### **STEP 2A: Body Shop Path**
```
┌─────────────────────────────────────────────────┐
│  🚗 Body Shop Service                           │
│                                                  │
│  Who will pay for the repair? *                 │
│  ┌──────────────────────────────────────────┐  │
│  │ ▼ Select Insurance Company                │  │
│  │                                            │  │
│  │   Private (Self-Pay)                      │  │
│  │   ────────────────────────────────        │  │
│  │   Allstate                                │  │
│  │   American Family                         │  │
│  │   Auto-Owners                             │  │
│  │   Erie Insurance                          │  │
│  │   Farmers Insurance                       │  │
│  │   Geico                                   │  │
│  │   Liberty Mutual                          │  │
│  │   Nationwide                              │  │
│  │   Progressive                             │  │
│  │   State Farm                              │  │
│  │   Travelers                               │  │
│  │   USAA                                    │  │
│  │   ────────────────────────────────        │  │
│  │   Other                                   │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  [If insurance selected, show:]                 │
│  ┌──────────────────────────────────────────┐  │
│  │ Claim Number (Optional)                   │  │
│  └──────────────────────────────────────────┘  │
│  ☐ I don't have a claim number yet             │
│                                                  │
│  📅 When would you like to bring your car?      │
│  ┌──────────────────────────────────────────┐  │
│  │ 📆 Select Date (Optional)                 │  │
│  │                                            │  │
│  │  [Opens calendar with available slots]    │  │
│  └──────────────────────────────────────────┘  │
│  ⓘ You can also skip and we'll contact you    │
│                                                  │
│          [ Continue → ]                         │
└─────────────────────────────────────────────────┘
```

---

### **STEP 2B: Mechanic Path**
```
┌─────────────────────────────────────────────────┐
│  🔧 Mechanic Service                            │
│                                                  │
│  Who will pay for the repair? *                 │
│  ┌──────────────────────────────────────────┐  │
│  │ ▼ Select Warranty Company                 │  │
│  │                                            │  │
│  │   Private (Self-Pay)                      │  │
│  │   ────────────────────────────────        │  │
│  │   CARCHEX                                 │  │
│  │   CarShield                               │  │
│  │   Choice                                  │  │
│  │   Concord                                 │  │
│  │   Endurance                               │  │
│  │   Olive                                   │  │
│  │   Protect My Car                          │  │
│  │   ProGuard                                │  │
│  │   Toco                                    │  │
│  │   ────────────────────────────────        │  │
│  │   Other                                   │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  [If warranty selected, show:]                  │
│  ┌──────────────────────────────────────────┐  │
│  │ Claim Number (Optional)                   │  │
│  └──────────────────────────────────────────┘  │
│  ☐ I don't have a claim number yet             │
│                                                  │
│  📅 When would you like to bring your car?      │
│  ┌──────────────────────────────────────────┐  │
│  │ 📆 Select Date (Optional)                 │  │
│  │                                            │  │
│  │  [Opens calendar with available slots]    │  │
│  └──────────────────────────────────────────┘  │
│  ⓘ You can also skip and we'll contact you    │
│                                                  │
│          [ Continue → ]                         │
└─────────────────────────────────────────────────┘
```

---

### **STEP 3: Vehicle Photos** (Body Shop Only)
```
┌─────────────────────────────────────────────────┐
│  📸 Vehicle Photos                              │
│                                                  │
│  Please take 6 photos of your vehicle *         │
│  (Tap on each box to open camera)               │
│                                                  │
│  Required Photos (6):                           │
│  ┌────────────┐  ┌────────────┐                │
│  │     📷     │  │     📷     │                │
│  │   Front    │  │   Front    │                │
│  │   Right    │  │    Left    │                │
│  └────────────┘  └────────────┘                │
│                                                  │
│  ┌────────────┐  ┌────────────┐                │
│  │     📷     │  │     📷     │                │
│  │    Rear    │  │    Rear    │                │
│  │   Right    │  │    Left    │                │
│  └────────────┘  └────────────┘                │
│                                                  │
│  ┌────────────┐  ┌────────────┐                │
│  │     📷     │  │     📷     │                │
│  │    VIN     │  │   Main     │                │
│  │   Number   │  │  Damage    │                │
│  └────────────┘  └────────────┘                │
│                                                  │
│  ─────────────────────────────────────────      │
│                                                  │
│  Optional Detail Photos (Up to 6):              │
│  ┌────────────┐  ┌────────────┐                │
│  │     📷     │  │     📷     │                │
│  │  Detail 1  │  │  Detail 2  │                │
│  └────────────┘  └────────────┘                │
│                                                  │
│  ┌────────────┐  ┌────────────┐                │
│  │     📷     │  │     📷     │                │
│  │  Detail 3  │  │  Detail 4  │                │
│  └────────────┘  └────────────┘                │
│                                                  │
│  ┌────────────┐  ┌────────────┐                │
│  │     📷     │  │     📷     │                │
│  │  Detail 5  │  │  Detail 6  │                │
│  └────────────┘  └────────────┘                │
│                                                  │
│          [ Continue → ]                         │
└─────────────────────────────────────────────────┘

Photo Requirements:
- Open native camera on mobile
- Show overlay guide for positioning
- Compress before upload
- Max 10MB per photo
```

---

### **STEP 4: Contact Preference**
```
┌─────────────────────────────────────────────────┐
│  📞 How would you like us to contact you? *     │
│                                                  │
│  Select your preferred contact method:          │
│                                                  │
│  ┌─────────────────────────────────────────┐   │
│  │  ☐ Phone Call                           │   │
│  │     We'll call you to discuss details    │   │
│  └─────────────────────────────────────────┘   │
│                                                  │
│  ┌─────────────────────────────────────────┐   │
│  │  ☐ WhatsApp Message                     │   │
│  │     Quick text message on WhatsApp       │   │
│  └─────────────────────────────────────────┘   │
│                                                  │
│  ┌─────────────────────────────────────────┐   │
│  │  ☐ Text Message                         │   │
│  │     SMS to your phone number             │   │
│  └─────────────────────────────────────────┘   │
│                                                  │
│  ⓘ You can select multiple options              │
│                                                  │
│  ┌─────────────────────────────────────────┐   │
│  │ Any additional notes? (Optional)         │   │
│  │                                          │   │
│  │                                          │   │
│  │                                          │   │
│  └─────────────────────────────────────────┘   │
│                                                  │
│          [ Submit Request 🚀 ]                  │
└─────────────────────────────────────────────────┘

Contact Preferences:
- Allow multiple selections
- At least one must be selected
- Save preferences for future
```

---

### **STEP 5: Confirmation**
```
┌─────────────────────────────────────────────────┐
│  ✅ Request Submitted Successfully!             │
│                                                  │
│  ┌───────────────────────────────────────────┐ │
│  │                                            │ │
│  │       ✨ Thank You, [First Name]!         │ │
│  │                                            │ │
│  │   We've received your estimate request    │ │
│  │                                            │ │
│  │   Reference Number: #FL-2024-XXXX         │ │
│  │                                            │ │
│  └───────────────────────────────────────────┘ │
│                                                  │
│  📧 Confirmation email sent to:                 │
│     [user@email.com]                            │
│                                                  │
│  ⏱️ What happens next?                          │
│  ┌─────────────────────────────────────────┐   │
│  │  1️⃣  We review your information          │   │
│  │      (Usually within 1 hour)             │   │
│  │                                          │   │
│  │  2️⃣  We contact you via your preferred   │   │
│  │      method                              │   │
│  │                                          │   │
│  │  3️⃣  We schedule your appointment        │   │
│  │      (if date selected)                  │   │
│  └─────────────────────────────────────────┘   │
│                                                  │
│  Need immediate assistance?                     │
│  📞 Call us: (321) 960-8661                    │
│                                                  │
│  [ ← Back to Home ]    [ Track Request → ]     │
└─────────────────────────────────────────────────┘
```

---

## 📊 **DATA STRUCTURE FOR ADMIN**

Form data will be saved as a Lead in the admin system:

```typescript
interface EstimateRequest {
  // Basic Info (Step 1)
  firstName: string;          // required
  lastName: string;           // required
  phone: string;             // required, formatted
  email: string;             // required, validated
  serviceType: 'bodyshop' | 'mechanic'; // required
  
  // Body Shop Specific
  insuranceCompany?: string;  // if bodyshop
  claimNumber?: string;       // optional
  hasClaimNumber?: boolean;   // flag
  
  // Mechanic Specific
  warrantyCompany?: string;   // if mechanic
  warrantyClaimNumber?: string; // optional
  hasWarrantyClaimNumber?: boolean; // flag
  
  // Scheduling
  preferredDate?: string;     // ISO date, optional
  dateSkipped?: boolean;      // flag
  
  // Photos (Body Shop only)
  photos?: {
    frontRight?: string;      // URL
    frontLeft?: string;       // URL
    rearRight?: string;       // URL
    rearLeft?: string;        // URL
    vinNumber?: string;       // URL
    mainDamage?: string;      // URL
    details?: string[];       // Array of URLs (up to 6)
  };
  
  // Contact Preference
  contactPreferences: {
    phoneCall: boolean;
    whatsapp: boolean;
    textMessage: boolean;
  };
  additionalNotes?: string;   // optional
  
  // Auto-generated
  referenceNumber: string;    // FL-2024-XXXX
  status: 'new';             // Always 'new' on creation
  source: 'website_form';    // Auto-set
  createdAt: string;         // ISO timestamp
}
```

---

## 🎨 **MOBILE DESIGN SPECS**

### **Layout Guidelines**
- **Max Width**: 480px on mobile
- **Padding**: 16px sides, 24px top/bottom
- **Font Sizes**: 
  - Labels: 14px
  - Inputs: 16px (prevents zoom on iOS)
  - Buttons: 16px bold
- **Touch Targets**: Minimum 44x44px
- **Spacing**: 16px between fields, 24px between sections

### **Photo Upload**
- **Camera Integration**: 
  - Use `<input type="file" accept="image/*" capture="environment">`
  - Shows overlay guide for photo positioning
  - Compress to max 2MB per photo
  - Show thumbnail after capture

### **Calendar**
- **Date Picker**: Native mobile picker (Mock for now)
- **Available Days**: Next 14 days
- **Business Hours**: 
  - Monday - Friday: 9:00 AM - 6:00 PM
  - Saturday: 9:00 AM - 12:00 PM
  - Sunday: Closed
- **Time Slots**: 1-hour blocks
- **Skip Option**: Prominent "Skip" button

---

## 🚀 **TECHNICAL IMPLEMENTATION PLAN**

### **Frontend** (Next.js)
1. Create `/estimate` page route
2. Multi-step form with React Hook Form
3. Form validation with Zod schema
4. Image upload with compression
5. Calendar integration
6. Progress indicator
7. Mobile-responsive design

### **Backend/API**
1. POST `/api/estimates` endpoint
2. Image upload to storage (S3/Cloudinary)
3. Email confirmation service
4. Create Lead in admin system
5. SMS/WhatsApp integration hooks

### **Admin Integration**
1. New leads appear in dashboard
2. Photos viewable in lead detail
3. Status tracking (new → contacted → scheduled)
4. Reference number searchable

---

## ✅ **APPROVED SPECIFICATIONS**

User confirmed the following:

1. **Insurance Companies List**: ✅ Added all major companies with "Other" option
   - State Farm, Progressive, Geico, Allstate, USAA, Farmers, Liberty Mutual, Nationwide, Travelers, American Family, Auto-Owners, Erie Insurance

2. **Warranty Companies List**: ✅ Complete list
   - CARCHEX, CarShield, Choice, Concord, Endurance, Olive, Protect My Car, ProGuard, Toco

3. **Photos**: ✅ Confirmed
   - Body Shop: 6 required + 6 optional
   - Mechanic: No photos needed

4. **Calendar Integration**: ✅ Mock for now
   - Business Hours: Monday-Friday 9:00-18:00, Saturday 9:00-12:00, Sunday closed

5. **Contact Preferences**: ✅ Confirmed
   - Text Message = SMS
   - WhatsApp uses same phone number

6. **Form Position**: ✅ **Modal Popup**
   - Opens when clicking "Free Estimate" button on main site

7. **Design Style**: ✅ **Match Main Site (www.flipcars.us)**
   - Deep blue/navy primary (#0B3B5E)
   - Bright orange accent (#FF7A1A)
   - Clean, professional auto-repair aesthetic

---

## 📋 **APPROVAL CHECKLIST**

Please review and approve:
- [ ] Flow makes sense
- [ ] All required fields correct
- [ ] Optional fields appropriate
- [ ] Insurance/Warranty lists complete
- [ ] Photo requirements clear
- [ ] Contact preferences correct
- [ ] Mobile design acceptable
- [ ] Ready to implement

**What changes or additions would you like?** 🎯
plement

**What changes or additions would you like?** 🎯
