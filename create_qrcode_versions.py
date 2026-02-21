import qrcode
from PIL import Image, ImageDraw, ImageFont
import os

# URL para o QR Code
url = "https://www.flipcars.us"

# 1. Criar QR Code base
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=20,
    border=2,
)
qr.add_data(url)
qr.make(fit=True)
qr_img = qr.make_image(fill_color="#000000", back_color="#D4A259").convert('RGB')

# Adicionar logo
logo_path = "/home/user/webapp/frontend-public/public/images/flipcars-logo.jpg"
if os.path.exists(logo_path):
    logo = Image.open(logo_path)
    qr_width, qr_height = qr_img.size
    logo_size = qr_width // 5
    logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    logo_bg = Image.new('RGB', (logo_size + 20, logo_size + 20), 'white')
    logo_bg.paste(logo, (10, 10))
    logo_pos = ((qr_width - logo_size - 20) // 2, (qr_height - logo_size - 20) // 2)
    qr_img.paste(logo_bg, logo_pos)

# 2. Versão com moldura e texto (para impressão)
canvas_width = qr_width + 100
canvas_height = qr_height + 200
canvas = Image.new('RGB', (canvas_width, canvas_height), '#FFFFFF')

# Colar QR Code
canvas.paste(qr_img, (50, 80))

# Adicionar texto
draw = ImageDraw.Draw(canvas)
try:
    font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 40)
    font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
except:
    font_large = ImageFont.load_default()
    font_small = ImageFont.load_default()

# Título
text1 = "SCAN TO BOOK"
bbox1 = draw.textbbox((0, 0), text1, font=font_large)
text1_width = bbox1[2] - bbox1[0]
draw.text(((canvas_width - text1_width) // 2, 20), text1, fill="#000000", font=font_large)

# URL embaixo
text2 = "www.flipcars.us"
bbox2 = draw.textbbox((0, 0), text2, font=font_small)
text2_width = bbox2[2] - bbox2[0]
draw.text(((canvas_width - text2_width) // 2, canvas_height - 60), text2, fill="#D4A259", font=font_small)

canvas.save("/home/user/webapp/flipcars_qrcode_print.png", quality=95)
print("✅ Versão para IMPRESSÃO criada: flipcars_qrcode_print.png")

# 3. Versão quadrada compacta (para redes sociais)
qr_img.save("/home/user/webapp/flipcars_qrcode_square.png", quality=95)
print("✅ Versão QUADRADA criada: flipcars_qrcode_square.png")

# 4. Versão grande para banner
qr_large = qr_img.resize((1200, 1200), Image.Resampling.LANCZOS)
qr_large.save("/home/user/webapp/flipcars_qrcode_large.png", quality=95)
print("✅ Versão GRANDE criada: flipcars_qrcode_large.png")

print("\n📊 RESUMO:")
print(f"   - QR Code básico: 660x660px")
print(f"   - QR Code impressão: {canvas_width}x{canvas_height}px")
print(f"   - QR Code grande: 1200x1200px")
print(f"   - URL: {url}")

