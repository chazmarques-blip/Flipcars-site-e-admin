const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://kvjvieekkudeqtnunqlb.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2anZpZWVra3VkZXF0bnVucWxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTc1MTY0OSwiZXhwIjoyMDc3MzI3NjQ5fQ.HdU6WH0JS-oNam1nkHvax6JQC3221VkFXpY1Ejz2x04';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkBuckets() {
  console.log('🔍 Checking Supabase Storage buckets...\n');
  
  const { data, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error('❌ Error listing buckets:', error);
    return;
  }
  
  console.log('📦 Available buckets:');
  data.forEach(bucket => {
    console.log(`  - ${bucket.name} (public: ${bucket.public})`);
  });
  
  return data;
}

async function createBucket() {
  console.log('\n📦 Creating "company-logos" bucket...');
  
  const { data, error } = await supabase.storage.createBucket('company-logos', {
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']
  });
  
  if (error) {
    console.error('❌ Error creating bucket:', error.message);
    return false;
  }
  
  console.log('✅ Bucket created successfully!');
  return true;
}

async function main() {
  const buckets = await checkBuckets();
  
  if (buckets && !buckets.find(b => b.name === 'company-logos')) {
    await createBucket();
  } else {
    console.log('\n✅ "company-logos" bucket already exists');
  }
}

main().catch(console.error);
