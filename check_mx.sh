#!/bin/bash
echo "=== Verificando MX Records de flipcars.us ==="
echo ""
echo "Tentando com diferentes métodos..."
echo ""

# Method 1: Using getent (if available)
if command -v getent &> /dev/null; then
    echo "Método 1 - getent:"
    getent hosts mail.flipcars.us
    echo ""
fi

# Method 2: Using curl to check IP
echo "Método 2 - IP de mail.flipcars.us:"
curl -s https://dns.google/resolve?name=mail.flipcars.us&type=A | grep -o '"data":"[^"]*"' || echo "DNS query via API falhou"
echo ""

# Method 3: Check what IP webmail resolves to
echo "Método 3 - Testando conectividade:"
timeout 3 curl -v telnet://mail.flipcars.us:25 2>&1 | grep -i "trying\|connected" || echo "Porta 25 não respondeu"
echo ""

echo "=== CONCLUSÃO ==="
echo "Se vê 216.198.79.1 → DNS aponta para Vercel (ERRADO)"
echo "Se vê outro IP → DNS pode estar em servidor diferente"
echo "Precisa mudar MX para ASPMX.L.GOOGLE.COM"
