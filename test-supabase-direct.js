#!/usr/bin/env node

/**
 * Test script to query Supabase directly for lead FL-2025-4645
 * This bypasses the backend API to verify if the lead exists in the database
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase credentials from backend/.env
const SUPABASE_URL = 'https://nsvzqehytuqwfaerzmau.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zdnpxZWh5dHVxd2ZhZXJ6bWF1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTEyMzkzMywiZXhwIjoyMDQ2Njk5OTMzfQ.5oMOO5VuGdRTM9F8Ye28kHLpgpxgMNGxcUixhwfY9pE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testLeadQuery() {
  console.log('🔍 Testing Supabase Direct Query for Lead FL-2025-4645\n');
  console.log('=' .repeat(70));

  try {
    // Test 1: Find specific lead by leadNumber
    console.log('\n📋 Test 1: Query by leadNumber = "FL-2025-4645"');
    console.log('-'.repeat(70));
    
    const { data: specificLead, error: specificError } = await supabase
      .from('leads')
      .select('*')
      .eq('leadNumber', 'FL-2025-4645')
      .single();

    if (specificError) {
      console.error('❌ Error:', specificError.message);
      if (specificError.code === 'PGRST116') {
        console.log('⚠️  Lead NOT FOUND with leadNumber "FL-2025-4645"');
      }
    } else {
      console.log('✅ Lead FOUND!');
      console.log('📄 Lead Details:');
      console.log(JSON.stringify(specificLead, null, 2));
    }

    // Test 2: Find by name containing "Juan" or "Felipe"
    console.log('\n📋 Test 2: Query by name containing "Juan" or "Felipe"');
    console.log('-'.repeat(70));
    
    const { data: nameLeads, error: nameError } = await supabase
      .from('leads')
      .select('*')
      .or('nome.ilike.%Juan%,nome.ilike.%Felipe%')
      .order('createdAt', { ascending: false })
      .limit(5);

    if (nameError) {
      console.error('❌ Error:', nameError.message);
    } else {
      console.log(`✅ Found ${nameLeads.length} leads with name matching "Juan" or "Felipe"`);
      nameLeads.forEach((lead, index) => {
        console.log(`\n${index + 1}. ${lead.leadNumber} - ${lead.nome}`);
        console.log(`   Email: ${lead.email}`);
        console.log(`   Created: ${lead.createdAt}`);
        console.log(`   Status: ${lead.status}`);
      });
    }

    // Test 3: Get latest 10 leads
    console.log('\n📋 Test 3: Get Latest 10 Leads (Ordered by createdAt DESC)');
    console.log('-'.repeat(70));
    
    const { data: latestLeads, error: latestError } = await supabase
      .from('leads')
      .select('id, leadNumber, nome, email, createdAt, status, origem')
      .order('createdAt', { ascending: false })
      .limit(10);

    if (latestError) {
      console.error('❌ Error:', latestError.message);
    } else {
      console.log(`✅ Found ${latestLeads.length} latest leads:\n`);
      latestLeads.forEach((lead, index) => {
        console.log(`${index + 1}. ${lead.leadNumber} | ${lead.nome} | ${lead.createdAt}`);
      });

      // Check if FL-2025-4645 is in the list
      const targetLead = latestLeads.find(l => l.leadNumber === 'FL-2025-4645');
      if (targetLead) {
        console.log(`\n✅ FL-2025-4645 IS in top 10 latest leads (position ${latestLeads.indexOf(targetLead) + 1})`);
      } else {
        console.log('\n⚠️  FL-2025-4645 NOT in top 10 latest leads');
      }
    }

    // Test 4: Count total leads
    console.log('\n📋 Test 4: Count Total Leads in Database');
    console.log('-'.repeat(70));
    
    const { count, error: countError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error:', countError.message);
    } else {
      console.log(`✅ Total leads in database: ${count}`);
    }

    // Test 5: Search by origem (public form)
    console.log('\n📋 Test 5: Query by origem = "Formulário Público"');
    console.log('-'.repeat(70));
    
    const { data: publicLeads, error: publicError } = await supabase
      .from('leads')
      .select('*')
      .eq('origem', 'Formulário Público')
      .order('createdAt', { ascending: false })
      .limit(5);

    if (publicError) {
      console.error('❌ Error:', publicError.message);
    } else {
      console.log(`✅ Found ${publicLeads.length} leads from public form:\n`);
      publicLeads.forEach((lead, index) => {
        console.log(`${index + 1}. ${lead.leadNumber} - ${lead.nome} (${lead.createdAt})`);
      });

      const targetLead = publicLeads.find(l => l.leadNumber === 'FL-2025-4645');
      if (targetLead) {
        console.log(`\n✅ FL-2025-4645 IS in public form leads`);
      } else {
        console.log('\n⚠️  FL-2025-4645 NOT in recent public form leads');
      }
    }

    // Test 6: Check table structure
    console.log('\n📋 Test 6: Verify Table Schema (First Lead as Sample)');
    console.log('-'.repeat(70));
    
    const { data: sampleLead, error: sampleError } = await supabase
      .from('leads')
      .select('*')
      .limit(1)
      .single();

    if (sampleError) {
      console.error('❌ Error:', sampleError.message);
    } else {
      console.log('✅ Table columns:');
      console.log(Object.keys(sampleLead).join(', '));
      console.log('\n📄 Sample lead structure:');
      console.log(JSON.stringify(sampleLead, null, 2));
    }

  } catch (error) {
    console.error('\n❌ Unexpected error:', error);
  }

  console.log('\n' + '='.repeat(70));
  console.log('🏁 Test Complete\n');
}

// Run the test
testLeadQuery().catch(console.error);
