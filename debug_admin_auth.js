// ========================================
// 🔍 DEBUG SCRIPT - Admin Dashboard Auth
// ========================================
// Cole este script no Console do Browser (F12 -> Console)

console.log("🔍 INICIANDO DIAGNÓSTICO...\n");

// 1. Verificar localStorage
console.log("1️⃣ VERIFICANDO LOCALSTORAGE:");
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');
const user = localStorage.getItem('flipcars-user');
const auth = localStorage.getItem('flipcars-auth');

console.log("   - accessToken:", accessToken ? "✅ Presente" : "❌ Ausente");
console.log("   - refreshToken:", refreshToken ? "✅ Presente" : "❌ Ausente");
console.log("   - flipcars-user:", user ? "✅ Presente" : "❌ Ausente");
console.log("   - flipcars-auth:", auth ? "✅ Presente" : "❌ Ausente");

// 2. Decodificar token JWT (se presente)
if (accessToken) {
  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    const expired = payload.exp < now;
    
    console.log("\n2️⃣ TOKEN JWT INFO:");
    console.log("   - Emitido em:", new Date(payload.iat * 1000).toISOString());
    console.log("   - Expira em:", new Date(payload.exp * 1000).toISOString());
    console.log("   - Status:", expired ? "❌ EXPIRADO" : "✅ VÁLIDO");
    console.log("   - Tempo até expirar:", Math.floor((payload.exp - now) / 60), "minutos");
  } catch (e) {
    console.error("   ❌ Erro ao decodificar token:", e);
  }
}

// 3. Testar requisição à API
console.log("\n3️⃣ TESTANDO REQUISIÇÃO À API:");
fetch('https://upbeat-dedication-production.up.railway.app/api/leads?page=1&limit=1', {
  headers: {
    'Authorization': 'Bearer ' + accessToken,
    'Accept': 'application/json'
  }
})
.then(res => {
  console.log("   - HTTP Status:", res.status);
  if (res.status === 200) {
    console.log("   ✅ API RESPONDE CORRETAMENTE");
  } else if (res.status === 401) {
    console.log("   ❌ TOKEN INVÁLIDO OU EXPIRADO (401 Unauthorized)");
  } else {
    console.log("   ⚠️ Status inesperado:", res.status);
  }
  return res.json();
})
.then(data => {
  console.log("   - Response data:", data);
})
.catch(err => {
  console.error("   ❌ Erro de rede:", err);
});

console.log("\n4️⃣ SOLUÇÃO:");
console.log("   Se o token está EXPIRADO ou AUSENTE, execute:");
console.log("   👉 localStorage.clear(); location.reload();");
console.log("   Depois, faça login novamente.\n");

console.log("========================================");
