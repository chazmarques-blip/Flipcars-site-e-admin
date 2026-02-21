import qrcode
from PIL import Image
import os

# URL para o QR Code
url = "https://www.flipcars.us"

# Criar QR Code de alta qualidade
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,  # Alta correção de erro (permite logo no centro)
    box_size=20,
    border=2,
)
qr.add_data(url)
qr.make(fit=True)

# Criar imagem do QR Code com cores da FlipCars
qr_img = qr.make_image(fill_color="#000000", back_color="#D4A259")  # Preto em fundo dourado

# Converter para RGB
qr_img = qr_img.convert('RGB')

# Tentar adicionar logo se existir
logo_path = "/home/user/webapp/frontend-public/public/images/flipcars-logo.jpg"
if os.path.exists(logo_path):
    try:
        logo = Image.open(logo_path)
        
        # Redimensionar logo para 1/5 do tamanho do QR Code
        qr_width, qr_height = qr_img.size
        logo_size = qr_width // 5
        logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        
        # Criar fundo branco para o logo
        logo_bg = Image.new('RGB', (logo_size + 20, logo_size + 20), 'white')
        logo_bg.paste(logo, (10, 10))
        
        # Calcular posição central
        logo_pos = ((qr_width - logo_size - 20) // 2, (qr_height - logo_size - 20) // 2)
        
        # Colar logo no centro do QR Code
        qr_img.paste(logo_bg, logo_pos)
        print("✅ Logo adicionado ao QR Code!")
    except Exception as e:
        print(f"⚠️ Erro ao adicionar logo: {e}")
        print("QR Code será criado sem logo")

# Salvar QR Code
output_path = "/home/user/webapp/flipcars_qrcode_with_logo.png"
qr_img.save(output_path, quality=95)
print(f"✅ QR Code criado: {output_path}")
print(f"📐 Dimensões: {qr_img.size}")
print(f"🔗 URL: {url}")

