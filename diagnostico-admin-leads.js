#!/usr/bin/env node

/**
 * Diagnóstico: Por que o Admin não consegue carregar os leads?
 * 
 * Este script testa:
 * 1. Conectividade com o backend do Railway
 * 2. Autenticação do usuário admin
 * 3. Endpoint GET /leads
 * 4. Permissões e roles
 */

const https = require('https');
const http = require('http');

// Cores para console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60) + '\n');
}

// Configurações
const BACKEND_URL = 'https://upbeat-dedication-production.up.railway.app/api';
const ADMIN_EMAIL = 'admin@flipcars.us';
const ADMIN_PASSWORD = 'Admin@FlipCars2024!';

/**
 * Faz requisição HTTP/HTTPS
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const reqOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FlipCars-Diagnostic/1.0',
        ...options.headers,
      },
    };

    const req = client.request(reqOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsed,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
            parseError: e.message,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

/**
 * Teste 1: Conectividade básica com o backend
 */
async function testConnectivity() {
  logSection('TESTE 1: Conectividade com Backend');
  
  try {
    log(`Tentando conectar em: ${BACKEND_URL}`, 'blue');
    
    // Testar primeiro a raiz da API
    let response = await makeRequest(`${BACKEND_URL}`);
    
    if (response.status === 200) {
      log('✅ Backend acessível (raiz da API)!', 'green');
      log(`Status: ${response.status}`, 'green');
      if (response.data) {
        log(`Resposta: ${JSON.stringify(response.data, null, 2)}`, 'green');
      }
      return true;
    }
    
    // Se a raiz não funcionar, tentar /health
    log(`Tentando ${BACKEND_URL}/health...`, 'blue');
    response = await makeRequest(`${BACKEND_URL}/health`);
    
    if (response.status === 200) {
      log('✅ Backend acessível (/health)!', 'green');
      log(`Status: ${response.status}`, 'green');
      if (response.data) {
        log(`Resposta: ${JSON.stringify(response.data, null, 2)}`, 'green');
      }
      return true;
    } else {
      log(`⚠️  Backend respondeu com status: ${response.status}`, 'yellow');
      log(`Resposta: ${JSON.stringify(response.data, null, 2)}`, 'yellow');
      return false;
    }
  } catch (error) {
    log('❌ Erro ao conectar com backend!', 'red');
    log(`Erro: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Teste 2: Login do Admin
 */
async function testAdminLogin() {
  logSection('TESTE 2: Login do Admin');
  
  try {
    log(`Email: ${ADMIN_EMAIL}`, 'blue');
    log(`Tentando fazer login...`, 'blue');
    
    const response = await makeRequest(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      body: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      },
    });
    
    if (response.status === 200 || response.status === 201) {
      log('✅ Login bem-sucedido!', 'green');
      log(`Status: ${response.status}`, 'green');
      
      if (response.data && response.data.accessToken) {
        log(`Token: ${response.data.accessToken.substring(0, 50)}...`, 'green');
        
        // Decodificar token (base64)
        try {
          const tokenParts = response.data.accessToken.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
            log('\nPayload do token:', 'cyan');
            log(JSON.stringify(payload, null, 2), 'green');
          }
        } catch (e) {
          log(`Não foi possível decodificar token: ${e.message}`, 'yellow');
        }
        
        return {
          success: true,
          token: response.data.accessToken,
          user: response.data.user,
        };
      } else {
        log('⚠️  Login bem-sucedido mas sem token na resposta', 'yellow');
        log(`Resposta: ${JSON.stringify(response.data, null, 2)}`, 'yellow');
        return { success: false };
      }
    } else {
      log(`❌ Login falhou com status: ${response.status}`, 'red');
      log(`Resposta: ${JSON.stringify(response.data, null, 2)}`, 'red');
      return { success: false };
    }
  } catch (error) {
    log('❌ Erro durante login!', 'red');
    log(`Erro: ${error.message}`, 'red');
    return { success: false };
  }
}

/**
 * Teste 3: Buscar leads
 */
async function testGetLeads(token) {
  logSection('TESTE 3: Buscar Leads (GET /leads)');
  
  if (!token) {
    log('❌ Token não disponível, pulando teste', 'red');
    return;
  }
  
  try {
    log(`Buscando leads com token...`, 'blue');
    
    const response = await makeRequest(`${BACKEND_URL}/leads`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    log(`Status da resposta: ${response.status}`, 'blue');
    
    if (response.status === 200) {
      log('✅ Leads carregados com sucesso!', 'green');
      
      if (response.data) {
        if (Array.isArray(response.data)) {
          log(`Total de leads: ${response.data.length}`, 'green');
          
          if (response.data.length > 0) {
            log('\nPrimeiro lead:', 'cyan');
            log(JSON.stringify(response.data[0], null, 2), 'green');
          } else {
            log('⚠️  Nenhum lead encontrado no banco de dados', 'yellow');
          }
        } else if (response.data.data && Array.isArray(response.data.data)) {
          log(`Total de leads: ${response.data.data.length}`, 'green');
          log(`Total geral: ${response.data.total || 'N/A'}`, 'green');
          log(`Página: ${response.data.page || 'N/A'}`, 'green');
          log(`Limite: ${response.data.limit || 'N/A'}`, 'green');
          
          if (response.data.data.length > 0) {
            log('\nPrimeiro lead:', 'cyan');
            log(JSON.stringify(response.data.data[0], null, 2), 'green');
          } else {
            log('⚠️  Nenhum lead encontrado no banco de dados', 'yellow');
          }
        } else {
          log('⚠️  Formato de resposta inesperado:', 'yellow');
          log(JSON.stringify(response.data, null, 2), 'yellow');
        }
      }
    } else if (response.status === 401) {
      log('❌ Não autorizado (401)', 'red');
      log('Token pode estar expirado ou inválido', 'red');
      log(`Resposta: ${JSON.stringify(response.data, null, 2)}`, 'red');
    } else if (response.status === 403) {
      log('❌ Proibido (403)', 'red');
      log('Usuário não tem permissão para acessar leads', 'red');
      log(`Resposta: ${JSON.stringify(response.data, null, 2)}`, 'red');
    } else {
      log(`❌ Erro ao buscar leads: ${response.status}`, 'red');
      log(`Resposta: ${JSON.stringify(response.data, null, 2)}`, 'red');
    }
  } catch (error) {
    log('❌ Erro ao buscar leads!', 'red');
    log(`Erro: ${error.message}`, 'red');
    log(`Stack: ${error.stack}`, 'red');
  }
}

/**
 * Teste 4: Verificar permissões do usuário
 */
async function testUserPermissions(token) {
  logSection('TESTE 4: Verificar Permissões do Usuário');
  
  if (!token) {
    log('❌ Token não disponível, pulando teste', 'red');
    return;
  }
  
  try {
    log(`Buscando perfil do usuário...`, 'blue');
    
    const response = await makeRequest(`${BACKEND_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.status === 200) {
      log('✅ Perfil carregado com sucesso!', 'green');
      log(JSON.stringify(response.data, null, 2), 'green');
      
      if (response.data.role) {
        log(`\nRole do usuário: ${response.data.role}`, 'cyan');
        
        const allowedRoles = ['admin', 'super_admin', 'agent'];
        if (allowedRoles.includes(response.data.role)) {
          log('✅ Usuário tem permissão para acessar leads', 'green');
        } else {
          log('❌ Usuário NÃO tem permissão para acessar leads', 'red');
          log(`Roles permitidas: ${allowedRoles.join(', ')}`, 'yellow');
        }
      }
    } else {
      log(`❌ Erro ao buscar perfil: ${response.status}`, 'red');
      log(`Resposta: ${JSON.stringify(response.data, null, 2)}`, 'red');
    }
  } catch (error) {
    log('❌ Erro ao buscar perfil!', 'red');
    log(`Erro: ${error.message}`, 'red');
  }
}

/**
 * Executar todos os testes
 */
async function runDiagnostics() {
  log('🔍 FlipCars Admin - Diagnóstico de Leads', 'bright');
  log('Este script vai testar a comunicação entre o Admin e o Backend\n', 'cyan');
  
  // Teste 1: Conectividade
  const isConnected = await testConnectivity();
  
  if (!isConnected) {
    log('\n❌ Backend não está acessível. Parando testes.', 'red');
    process.exit(1);
  }
  
  // Teste 2: Login
  const loginResult = await testAdminLogin();
  
  if (!loginResult.success) {
    log('\n❌ Não foi possível fazer login. Parando testes.', 'red');
    process.exit(1);
  }
  
  // Teste 3: Buscar leads
  await testGetLeads(loginResult.token);
  
  // Teste 4: Verificar permissões
  await testUserPermissions(loginResult.token);
  
  // Resumo final
  logSection('RESUMO DO DIAGNÓSTICO');
  log('Testes concluídos!', 'green');
  log('\nSe você viu "No leads found" no admin, pode ser porque:', 'yellow');
  log('1. ✅ Backend está funcionando', 'green');
  log('2. ✅ Autenticação está funcionando', 'green');
  log('3. ⚠️  Banco de dados pode estar vazio (sem leads)', 'yellow');
  log('4. ⚠️  Migration contact_preferences pode não ter sido executada', 'yellow');
  log('\nPróximos passos:', 'cyan');
  log('1. Verificar se existem leads no banco de dados', 'blue');
  log('2. Executar a migration: ALTER TABLE "leads" ADD COLUMN "contact_preferences" jsonb NULL;', 'blue');
  log('3. Criar um lead de teste através do formulário público', 'blue');
}

// Executar
runDiagnostics().catch((error) => {
  log('\n❌ Erro fatal durante diagnóstico:', 'red');
  log(error.message, 'red');
  log(error.stack, 'red');
  process.exit(1);
});
