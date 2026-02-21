import qrcode
from PIL import Image, ImageDraw
import os

# URL para o QR Code
url = "https://www.flipcars.us"

# Criar QR Code GRANDE
qr_large = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=40,
    border=2,
)
qr_large.add_data(url)
qr_large.make(fit=True)
qr_img_large = qr_large.make_image(fill_color="#000000", back_color="#D4A259").convert('RGB')

# Adicionar logo
logo_path = "/home/user/webapp/frontend-public/public/images/flipcars-logo.jpg"
if os.path.exists(logo_path):
    logo = Image.open(logo_path)
    qr_width = qr_img_large.size[0]
    logo_size = qr_width // 5
    logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    logo_bg = Image.new('RGB', (logo_size + 30, logo_size + 30), 'white')
    logo_bg.paste(logo, (15, 15))
    logo_pos = ((qr_width - logo_size - 30) // 2, (qr_width - logo_size - 30) // 2)
    qr_img_large.paste(logo_bg, logo_pos)

# Criar canvas redondo grande
canvas_large_size = qr_img_large.size[0] + 150
canvas_large = Image.new('RGB', (canvas_large_size, canvas_large_size), '#FFFFFF')
canvas_large.paste(qr_img_large, (75, 75))

# Máscara circular
mask_large = Image.new('L', (canvas_large_size, canvas_large_size), 0)
draw_large = ImageDraw.Draw(mask_large)
draw_large.ellipse((20, 20, canvas_large_size-20, canvas_large_size-20), fill=255)

# Aplicar máscara
output_large = Image.new('RGBA', (canvas_large_size, canvas_large_size), (255, 255, 255, 0))
canvas_large_rgba = canvas_large.convert('RGBA')
output_large.paste(canvas_large_rgba, (0, 0))
output_large.putalpha(mask_large)

output_large.save("/home/user/webapp/flipcars_qrcode_ROUND_LARGE.png", quality=95)
print(f"✅ QR Code REDONDO GRANDE: {canvas_large_size}x{canvas_large_size}px")

