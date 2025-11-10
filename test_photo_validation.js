// Teste da correção de validação de fotos

const testPhotos = {
  // Fotos com URL completa (como o backend retorna)
  details: [
    'https://upbeat-dedication-production.up.railway.app/uploads/lead-photos/1762800794319-649830901.png',
    'https://upbeat-dedication-production.up.railway.app/uploads/lead-photos/1762800794383-408520762.png'
  ],
  driverFront: 'https://upbeat-dedication-production.up.railway.app/uploads/lead-photos/test-1.png'
};

// VERSÃO ANTIGA (QUEBRADA):
const oldValidation = Object.values(testPhotos).some(
  (photo) => typeof photo === 'string' && photo.startsWith('/uploads/')
);

// VERSÃO NOVA (CORRIGIDA):
const newValidation = Object.values(testPhotos).some(
  (photo) => typeof photo === 'string' && (photo.startsWith('/uploads/') || photo.startsWith('http'))
);

console.log('📋 Test Photos:', testPhotos);
console.log('');
console.log('❌ OLD Validation Result:', oldValidation);
console.log('   → Would send photos?', oldValidation ? 'YES ✅' : 'NO ❌');
console.log('');
console.log('✅ NEW Validation Result:', newValidation);
console.log('   → Would send photos?', newValidation ? 'YES ✅' : 'NO ❌');
console.log('');
console.log('🎯 FIX STATUS:', newValidation ? '✅ WORKING!' : '❌ STILL BROKEN');
