const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const SUPABASE_URL = 'https://kvjvieekkudeqtnunqlb.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2anZpZWVra3VkZXF0bnVucWxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTc1MTY0OSwiZXhwIjoyMDc3MzI3NjQ5fQ.HdU6WH0JS-oNam1nkHvax6JQC3221VkFXpY1Ejz2x04';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Warranty company logos to upload
const warrantyLogos = [
  { file: 'warranty-carchex.png', company: 'CARCHEX' },
  { file: 'warranty-carshield.jpg', company: 'CarShield' },
  { file: 'warranty-endurance.png', company: 'Endurance' },
  { file: 'warranty-protect-my-car.png', company: 'Protect My Car' },
];

async function uploadLogo(filePath, fileName) {
  try {
    console.log(`📤 Uploading ${fileName}...`);
    
    // Read file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Determine content type
    const ext = path.extname(fileName).toLowerCase();
    const contentType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('company-logos')
      .upload(fileName, fileBuffer, {
        contentType,
        upsert: true, // Replace if exists
      });

    if (error) {
      console.error(`❌ Error uploading ${fileName}:`, error.message);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('company-logos')
      .getPublicUrl(fileName);

    console.log(`✅ Uploaded ${fileName}: ${urlData.publicUrl}`);
    return urlData.publicUrl;
  } catch (err) {
    console.error(`❌ Exception uploading ${fileName}:`, err.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting warranty logo upload to Supabase Storage...\n');

  const imagesDir = path.join(__dirname, '../frontend-public/public/images');
  const results = {};

  for (const logo of warrantyLogos) {
    const filePath = path.join(imagesDir, logo.file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${logo.file}`);
      continue;
    }

    const url = await uploadLogo(filePath, logo.file);
    if (url) {
      results[logo.company] = url;
    }
  }

  console.log('\n📋 Upload Results:');
  console.log(JSON.stringify(results, null, 2));
  
  console.log('\n✨ Upload completed!');
  console.log('\n📝 Update your code with these URLs:');
  console.log('const logoMap: Record<string, string> = {');
  for (const [company, url] of Object.entries(results)) {
    console.log(`  '${company}': '${url}',`);
  }
  console.log('};');
}

main().catch(console.error);
