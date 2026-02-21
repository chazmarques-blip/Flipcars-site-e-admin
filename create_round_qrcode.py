import qrcode
from PIL import Image, ImageDraw
import os

# URL para o QR Code
url = "https://www.flipcars.us"

# 1. Criar QR Code base de alta qualidade
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=25,
    border=2,
)
qr.add_data(url)
qr.make(fit=True)
qr_img = qr.make_image(fill_color="#000000", back_color="#D4A259").convert('RGB')

# 2. Adicionar logo da FlipCars
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
    print(f"✅ Logo FlipCars adicionada ao QR Code!")

# 3. Criar versão REDONDA
size = qr_img.size[0]

# Criar canvas quadrado maior para adicionar padding
canvas_size = size + 100
canvas = Image.new('RGB', (canvas_size, canvas_size), '#FFFFFF')

# Colar QR Code no centro
offset = 50
canvas.paste(qr_img, (offset, offset))

# Criar máscara circular
mask = Image.new('L', (canvas_size, canvas_size), 0)
draw = ImageDraw.Draw(mask)
draw.ellipse((10, 10, canvas_size-10, canvas_size-10), fill=255)

# Aplicar máscara circular
output = Image.new('RGBA', (canvas_size, canvas_size), (255, 255, 255, 0))
canvas_rgba = canvas.convert('RGBA')
output.paste(canvas_rgba, (0, 0))
output.putalpha(mask)

# Salvar versão com transparência (PNG)
output.save("/home/user/webapp/flipcars_qrcode_ROUND_transparent.png", quality=95)
print(f"✅ QR Code REDONDO (transparente) criado!")

# 4. Versão com borda dourada (sem transparência - para impressão)
canvas_gold = Image.new('RGB', (canvas_size, canvas_size), '#D4A259')
canvas_gold.paste(qr_img, (offset, offset))

# Criar máscara com borda
mask_bordered = Image.new('L', (canvas_size, canvas_size), 0)
draw_bordered = ImageDraw.Draw(mask_bordered)
# Círculo externo (borda dourada)
draw_bordered.ellipse((0, 0, canvas_size, canvas_size), fill=255)
# Círculo interno (conteúdo)
draw_bordered.ellipse((15, 15, canvas_size-15, canvas_size-15), fill=255)

output_gold = Image.new('RGB', (canvas_size, canvas_size), '#D4A259')
# Criar máscara para o QR Code
mask_content = Image.new('L', (canvas_size, canvas_size), 0)
draw_content = ImageDraw.Draw(mask_content)
draw_content.ellipse((15, 15, canvas_size-15, canvas_size-15), fill=255)

# Aplicar QR Code apenas dentro do círculo
temp = Image.new('RGB', (canvas_size, canvas_size), '#FFFFFF')
temp.paste(canvas_gold, (0, 0))
output_gold.paste(temp, (0, 0), mask_content)

output_gold.save("/home/user/webapp/flipcars_qrcode_ROUND_gold.png", quality=95)
print(f"✅ QR Code REDONDO (borda dourada) criado!")

# 5. Versão GRANDE redonda (para impressão)
large_size = 1500
qr_large = qr.make_image(fill_color="#000000", back_color="#D4A259", box_size=40, border=2).convert('RGB')

# Adicionar logo na versão grande
if os.path.exists(logo_path):
    logo_large = Image.open(logo_path)
    qr_l_width = qr_large.size[0]
    logo_l_size = qr_l_width // 5
    logo_large = logo_large.resize((logo_l_size, logo_l_size), Image.Resampling.LANCZOS)
    logo_l_bg = Image.new('RGB', (logo_l_size + 30, logo_l_size + 30), 'white')
    logo_l_bg.paste(logo_large, (15, 15))
    logo_l_pos = ((qr_l_width - logo_l_size - 30) // 2, (qr_l_width - logo_l_size - 30) // 2)
    qr_large.paste(logo_l_bg, logo_l_pos)

# Criar canvas grande
canvas_large_size = qr_large.size[0] + 150
canvas_large = Image.new('RGB', (canvas_large_size, canvas_large_size), '#FFFFFF')
canvas_large.paste(qr_large, (75, 75))

# Máscara circular grande
mask_large = Image.new('L', (canvas_large_size, canvas_large_size), 0)
draw_large = ImageDraw.Draw(mask_large)
draw_large.ellipse((20, 20, canvas_large_size-20, canvas_large_size-20), fill=255)

output_large = Image.new('RGBA', (canvas_large_size, canvas_large_size), (255, 255, 255, 0))
canvas_large_rgba = canvas_large.convert('RGBA')
output_large.paste(canvas_large_rgba, (0, 0))
output_large.putalpha(mask_large)

output_large.save("/home/user/webapp/flipcars_qrcode_ROUND_LARGE.png", quality=95)
print(f"✅ QR Code REDONDO GRANDE criado!")

print(f"\n📊 RESUMO:")
print(f"   - QR Code redondo transparente: {canvas_size}x{canvas_size}px")
print(f"   - QR Code redondo borda dourada: {canvas_size}x{canvas_size}px")
print(f"   - QR Code redondo GRANDE: {canvas_large_size}x{canvas_large_size}px")
print(f"   - URL: {url}")
print(f"   - Logo: ✅ FlipCars integrada")

