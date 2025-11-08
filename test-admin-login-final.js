#!/usr/bin/env node
/**
 * FlipCars Admin Login Test
 * Simula login no frontend com credenciais do admin
 */

const https = require('https');

const API_URL = 'https://upbeat-dedication-production.up.railway.app';
const FRONTEND_URL = 'https://admin.flipcars.us';

// Credenciais do admin
const credentials = {
  email: 'admin@flipcars.com',
  password: 'Admin123!'
};

console.log('🚗 FlipCars Admin Login Test\n');
console.log('📍 Backend API:', API_URL);
console.log('🌐 Frontend:', FRONTEND_URL);
console.log('👤 Testing login with:', credentials.email);
console.log('=' .repeat(60));

// Função para fazer POST request
function httpsPost(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: jsonBody
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(postData);
    req.end();
  });
}

// Testar login
async function testLogin() {
  try {
    console.log('\n1️⃣ Testing backend login endpoint...');
    console.log(`   POST ${API_URL}/api/auth/login`);
    
    const response = await httpsPost(`${API_URL}/api/auth/login`, credentials);
    
    console.log(`\n✅ Response Status: ${response.statusCode}`);
    
    if (response.statusCode === 200) {
      console.log('\n🎉 LOGIN SUCCESSFUL!');
      console.log('\n📦 Response Data:');
      console.log('   User:', response.body.user);
      console.log('   Access Token:', response.body.tokens.accessToken.substring(0, 50) + '...');
      console.log('   Refresh Token:', response.body.tokens.refreshToken.substring(0, 50) + '...');
      console.log('\n✅ Backend authentication is working correctly!');
      console.log('\n🌐 Frontend should now be able to login at:');
      console.log(`   ${FRONTEND_URL}/auth/login`);
      console.log('\n📝 Use these credentials:');
      console.log(`   Email: ${credentials.email}`);
      console.log(`   Password: ${credentials.password}`);
      console.log('\n' + '='.repeat(60));
      console.log('✅ ALL TESTS PASSED - System is ready to use!');
      console.log('='.repeat(60));
      
      return true;
    } else {
      console.log('\n❌ LOGIN FAILED');
      console.log('   Status:', response.statusCode);
      console.log('   Body:', response.body);
      return false;
    }
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    return false;
  }
}

// Executar teste
testLogin().then((success) => {
  process.exit(success ? 0 : 1);
});
