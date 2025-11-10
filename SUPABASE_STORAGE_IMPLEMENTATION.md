# 📦 Supabase Storage Implementation for Photo Uploads
## Persistent Photo Storage Solution for FlipCars

---

## 🎯 **OBJECTIVE**

Replace Railway's ephemeral filesystem with **Supabase Storage** for persistent photo uploads.

### Current Problem:
- ❌ Photos uploaded to `/uploads/lead-photos/` on Railway
- ❌ Railway containers are ephemeral (files deleted on restart)
- ❌ All uploaded photos return 404 after container restart
- ✅ Database persists data, but physical files do not

### Solution:
- ✅ Store photos in Supabase Storage bucket
- ✅ Photos persist permanently (cloud storage)
- ✅ Direct CDN URLs for fast access
- ✅ Integrated with existing Supabase database

---

## ⚠️ **PREREQUISITE**

**You MUST complete the database fix first!**
- Ensure backend is connected to **"My Truck Admin"** Supabase project
- Verify DATABASE_URL in Railway points to correct database
- Test database connection is working

---

## 📋 **IMPLEMENTATION STEPS**

### **Step 1: Create Storage Bucket in Supabase**

1. Log in to [Supabase Dashboard](https://app.supabase.com)
2. Select **"My Truck Admin"** project
3. Go to **Storage** in left sidebar
4. Click **"Create a new bucket"**
5. Configure bucket:
   - **Name**: `lead-photos`
   - **Public bucket**: ✅ Yes (so photos are accessible via URL)
   - **File size limit**: 5MB (or your preference)
   - **Allowed MIME types**: `image/*` (all image types)

6. Click **"Create bucket"**

---

### **Step 2: Configure Bucket Policies (Security)**

After creating the bucket, set up policies:

1. Go to **Storage** → **Policies** → `lead-photos` bucket
2. Click **"New Policy"**

#### Policy 1: Public Read Access
```sql
-- Allow anyone to read/view photos
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'lead-photos');
```

#### Policy 2: Authenticated Upload Access
```sql
-- Allow authenticated users to upload photos
CREATE POLICY "Authenticated upload access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'lead-photos');
```

#### Policy 3: Service Role Full Access
```sql
-- Allow service role (backend) full access
CREATE POLICY "Service role full access"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'lead-photos');
```

**💡 Note**: You can also create these policies using the Supabase dashboard UI.

---

### **Step 3: Get Supabase Credentials**

From **"My Truck Admin"** project:

1. Go to **Settings** → **API**
2. Copy these values:

```env
SUPABASE_URL = https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey... (anon public key)
SUPABASE_SERVICE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey... (service_role secret)
```

**⚠️ SECURITY WARNING**: 
- **Never commit service_role key to Git!**
- Only store in Railway environment variables
- Use anon_key for frontend, service_role for backend

---

### **Step 4: Install Supabase Client in Backend**

```bash
cd backend
npm install @supabase/supabase-js
```

This will add Supabase client library to your backend project.

---

### **Step 5: Create Supabase Service Module**

Create a new service to handle Supabase operations:

**File**: `backend/src/modules/storage/supabase.service.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.warn('Supabase credentials not configured. Storage features will be disabled.');
      return;
    }

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    this.logger.log('Supabase client initialized successfully');
  }

  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(
    bucket: string,
    path: string,
    file: Buffer | File,
    contentType: string,
  ): Promise<{ url: string; path: string }> {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(path, file, {
          contentType,
          upsert: false, // Don't overwrite existing files
        });

      if (error) {
        this.logger.error(`Failed to upload file: ${error.message}`, error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      return {
        url: urlData.publicUrl,
        path: data.path,
      };
    } catch (error) {
      this.logger.error('Error uploading file to Supabase', error);
      throw error;
    }
  }

  /**
   * Delete a file from Supabase Storage
   */
  async deleteFile(bucket: string, path: string): Promise<void> {
    try {
      const { error } = await this.supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        this.logger.error(`Failed to delete file: ${error.message}`, error);
        throw new Error(`Delete failed: ${error.message}`);
      }

      this.logger.log(`File deleted successfully: ${path}`);
    } catch (error) {
      this.logger.error('Error deleting file from Supabase', error);
      throw error;
    }
  }

  /**
   * Get public URL for a file
   */
  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  /**
   * Check if Supabase is configured
   */
  isConfigured(): boolean {
    return !!this.supabase;
  }
}
```

---

### **Step 6: Update Upload Controller**

Modify the upload controller to use Supabase Storage instead of local filesystem:

**File**: `backend/src/modules/leads/upload.controller.ts`

```typescript
import { SupabaseService } from '../storage/supabase.service';

@Controller('api/leads')
export class UploadController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Post('upload-photo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new BadRequestException('Invalid file type. Only images are allowed.');
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = file.originalname.split('.').pop();
      const filename = `${timestamp}-${randomString}.${extension}`;
      const storagePath = `lead-photos/${filename}`;

      // Upload to Supabase Storage
      const { url } = await this.supabaseService.uploadFile(
        'lead-photos',
        storagePath,
        file.buffer,
        file.mimetype,
      );

      return {
        success: true,
        url: url, // Full Supabase Storage URL
        path: storagePath,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload photo');
    }
  }
}
```

---

### **Step 7: Update Railway Environment Variables**

Add Supabase credentials to Railway:

1. Go to Railway Dashboard → Your Backend Service
2. Go to **Variables** tab
3. Add these variables:

```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Important**: 
- Use the **service_role** key (not anon key) for backend
- Keep this secret and never commit to Git

---

### **Step 8: Register Supabase Service Module**

**File**: `backend/src/modules/storage/storage.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Module({
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class StorageModule {}
```

**File**: `backend/src/app.module.ts`

```typescript
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    // ... other imports
    StorageModule,
  ],
  // ...
})
export class AppModule {}
```

---

### **Step 9: Update Package.json & Deploy**

1. Commit all changes:
```bash
git add .
git commit -m "feat: Implement Supabase Storage for photo uploads"
```

2. Push to trigger Railway deployment:
```bash
git push origin main
```

3. Wait for Railway to deploy with new environment variables

---

### **Step 10: Test Photo Upload**

1. Go to admin dashboard
2. Create a new lead with photos
3. Upload photos using the form
4. Verify photos display correctly
5. **Restart Railway container** (simulate production restart)
6. Check photos still display ✅ (should work now!)

---

## 🔍 **VERIFICATION CHECKLIST**

- [ ] Supabase bucket `lead-photos` created
- [ ] Bucket is set to public access
- [ ] Storage policies configured correctly
- [ ] Supabase credentials copied from dashboard
- [ ] `@supabase/supabase-js` installed in backend
- [ ] SupabaseService created and configured
- [ ] Upload controller updated to use Supabase
- [ ] Railway environment variables added
- [ ] Backend redeployed successfully
- [ ] Photo upload test successful
- [ ] Photos persist after Railway restart ✅

---

## 📊 **BEFORE vs AFTER**

### Before (Railway Filesystem):
```
Upload Photo → Backend → /uploads/lead-photos/photo.jpg
                         ❌ Deleted on container restart
                         ❌ 404 errors after deploy
```

### After (Supabase Storage):
```
Upload Photo → Backend → Supabase Storage → lead-photos/photo.jpg
                         ✅ Persists permanently
                         ✅ CDN URL: https://xxxxx.supabase.co/storage/v1/object/public/lead-photos/photo.jpg
```

---

## 🚀 **BENEFITS**

- ✅ **Persistent Storage**: Photos never deleted
- ✅ **CDN Performance**: Fast global delivery
- ✅ **Scalability**: No server storage limits
- ✅ **Cost-Effective**: Supabase free tier includes 1GB storage
- ✅ **Integrated**: Same Supabase project as database
- ✅ **Security**: Role-based access policies

---

## 🔧 **TROUBLESHOOTING**

### "Supabase client not initialized" error:
- Check SUPABASE_URL and SUPABASE_SERVICE_KEY in Railway
- Verify values are correct (no extra spaces)
- Redeploy Railway after adding variables

### "Bucket does not exist" error:
- Verify bucket name is exactly `lead-photos`
- Check bucket was created in correct Supabase project ("My Truck Admin")

### "Insufficient permissions" error:
- Check storage policies are configured
- Use service_role key (not anon key) in backend
- Verify policies allow uploads to lead-photos bucket

### Photos not displaying:
- Check bucket is set to **public**
- Verify URL format is correct
- Open URL directly in browser to test access

---

## 📝 **NEXT STEPS AFTER IMPLEMENTATION**

1. **Migrate Old Photos** (if any):
   - Download existing photos from Railway (if accessible)
   - Upload to Supabase Storage bucket
   - Update database URLs to point to new Supabase URLs

2. **Add Photo Optimization**:
   - Resize images before upload
   - Generate thumbnails for gallery view
   - Compress images to reduce storage costs

3. **Implement Photo Management**:
   - Delete old photos when lead is deleted
   - Add photo editing/cropping features
   - Support multiple photo formats

---

**Ready to implement? Start with Step 1!** 🚀

**Remember: Fix the database connection FIRST, then implement Supabase Storage!**
