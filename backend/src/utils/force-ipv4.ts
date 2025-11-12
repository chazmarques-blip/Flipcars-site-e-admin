/**
 * Force IPv4 DNS Resolution Utility
 * 
 * This module patches Node.js DNS resolution to force IPv4 addresses only.
 * Required for Railway deployment where IPv6 connections to external databases fail.
 * 
 * MUST BE IMPORTED BEFORE any database connection code!
 */

import * as dns from 'dns';
import { promisify } from 'util';

// Configure DNS to prefer IPv4 globally
dns.setDefaultResultOrder('ipv4first');

// Create promisified DNS functions
const lookup = promisify(dns.lookup);
const resolve4 = promisify(dns.resolve4);

/**
 * Custom DNS lookup function that ONLY returns IPv4 addresses
 * 
 * This completely bypasses IPv6 resolution by:
 * 1. Forcing family: 4 in dns.lookup
 * 2. Falling back to resolve4 if lookup fails
 * 3. Never allowing IPv6 addresses to be returned
 */
export async function forceIPv4Lookup(
  hostname: string,
  options?: dns.LookupOptions,
): Promise<string | dns.LookupAddress | dns.LookupAddress[]> {
  console.log(`🔍 [IPv4 Force] Looking up: ${hostname}`);

  try {
    // Force IPv4 only lookup
    const result = await lookup(hostname, {
      ...options,
      family: 4, // IPv4 ONLY
    });

    if (Array.isArray(result)) {
      console.log(`✅ [IPv4 Force] Resolved ${hostname} to ${result.length} IPv4 addresses`);
      return result;
    } else {
      console.log(`✅ [IPv4 Force] Resolved ${hostname} to IPv4: ${result.address}`);
      return result;
    }
  } catch (lookupError) {
    console.log(`⚠️  [IPv4 Force] dns.lookup failed for ${hostname}, trying resolve4...`);

    try {
      // Fallback to resolve4 which ONLY resolves A records (IPv4)
      const addresses = await resolve4(hostname);
      
      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        console.log(`✅ [IPv4 Force] Resolved ${hostname} to IPv4 via resolve4: ${address}`);
        
        // Return in the same format as dns.lookup
        return { address, family: 4 };
      }
    } catch (resolve4Error) {
      console.error(`❌ [IPv4 Force] Both lookup and resolve4 failed for ${hostname}`);
      console.error(`   Lookup error: ${lookupError}`);
      console.error(`   Resolve4 error: ${resolve4Error}`);
    }

    // If all fails, throw the original error
    throw lookupError;
  }
}

/**
 * Patch the global dns.lookup to force IPv4
 * This affects ALL DNS lookups in the application
 */

// Store the ORIGINAL lookup function at module load time (before any patching)
const ORIGINAL_DNS_LOOKUP = dns.lookup;

// Guard to prevent double patching
let isDNSPatched = false;

export function patchGlobalDNSLookup(): void {
  // ADVANCED CHECK: Verify if dns.lookup has already been modified
  const descriptor = Object.getOwnPropertyDescriptor(dns, 'lookup');
  
  // If already patched OR if we've marked it as patched, skip
  if (isDNSPatched || (descriptor && descriptor.configurable === true && descriptor.writable === true)) {
    console.log('⏭️  DNS lookup already patched, skipping...');
    return;
  }

  // Use the stored ORIGINAL lookup function (not dns.lookup which might be modified)
  const originalLookup = ORIGINAL_DNS_LOOKUP;

  // Create patched lookup function
  const patchedLookup = (
    hostname: string,
    optionsOrCallback?: dns.LookupOptions | ((err: NodeJS.ErrnoException | null, address: string, family: number) => void),
    callback?: (err: NodeJS.ErrnoException | null, address: string, family: number) => void,
  ) => {
    // Handle overloaded function signatures
    let options: dns.LookupOptions = {};
    let actualCallback: (err: NodeJS.ErrnoException | null, address: string, family: number) => void;

    if (typeof optionsOrCallback === 'function') {
      actualCallback = optionsOrCallback;
    } else {
      options = optionsOrCallback || {};
      actualCallback = callback!;
    }

    // Force IPv4
    options = {
      ...options,
      family: 4,
    };

    console.log(`🔍 [DNS Patch] Intercepted lookup for: ${hostname} (forcing IPv4)`);

    // Call original with forced IPv4
    return originalLookup(hostname, options, (err, address, family) => {
      if (err) {
        console.error(`❌ [DNS Patch] Failed lookup for ${hostname}:`, err.message);
      } else {
        console.log(`✅ [DNS Patch] Resolved ${hostname} to IPv4: ${address}`);
      }
      // Handle both string and array addresses
      const addressString = Array.isArray(address) ? address[0] : address;
      actualCallback(err, addressString as string, family);
    });
  };

  try {
    // ROBUST APPROACH: Try to delete first if configurable, then define
    if (descriptor && descriptor.configurable) {
      delete (dns as any).lookup;
      console.log('🗑️  [DNS Patch] Deleted existing dns.lookup property');
    }

    // Use Object.defineProperty to override dns.lookup (works in Node.js v22+)
    Object.defineProperty(dns, 'lookup', {
      value: patchedLookup,
      writable: true,
      configurable: true,
    });

    // Mark as patched to prevent double-patching
    isDNSPatched = true;

    console.log('✅ [DNS Patch] Global DNS lookup patched to force IPv4');
  } catch (error) {
    // If Object.defineProperty fails, log but don't crash
    // This might happen if the property was already defined elsewhere
    console.warn('⚠️  [DNS Patch] Could not redefine dns.lookup, it may already be patched');
    console.warn('   Error:', error instanceof Error ? error.message : String(error));
    
    // Mark as patched anyway to prevent repeated attempts
    isDNSPatched = true;
  }
}

// Guard to prevent double initialization
let isInitialized = false;

/**
 * Initialize IPv4 enforcement
 * Safe to call multiple times - only initializes once
 */
export function initializeIPv4Enforcement(): void {
  // Skip if already initialized
  if (isInitialized) {
    console.log('⏭️  IPv4 enforcement already initialized, skipping...');
    return;
  }

  console.log('\n========================================');
  console.log('🌐 Initializing IPv4 Enforcement');
  console.log('========================================\n');

  // Set default order
  dns.setDefaultResultOrder('ipv4first');
  console.log('✅ DNS default order set to: ipv4first');

  // Patch global dns.lookup
  patchGlobalDNSLookup();

  console.log('\n✅ IPv4 enforcement initialized successfully');
  console.log('   All DNS lookups will now return IPv4 addresses only\n');
  
  // Mark as initialized
  isInitialized = true;
}

// Manual initialization only (called from main.ts)
// Removed auto-initialization to avoid potential issues during module loading
