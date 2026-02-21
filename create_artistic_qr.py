import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer, CircleModuleDrawer, GappedSquareModuleDrawer
from qrcode.image.styles.colormasks import SolidFillColorMask
from PIL import Image, ImageDraw, ImageFilter
import os

url = "https://www.flipcars.us"

# 1. VERSÃO COM MÓDULOS ARREDONDADOS SUAVES (estilo da referência)
print("🎨 Criando QR Code estilo ARTÍSTICO...")

qr1 = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=20,
    border=4,
)
qr1.add_data(url)
qr1.make(fit=True)

# Criar com módulos arredondados
img_artistic = qr1.make_image(
    image_factory=StyledPilImage,
    module_drawer=RoundedModuleDrawer(),
    color_mask=SolidFillColorMask(back_color=(212, 162, 89), front_color=(0, 0, 0))
)

img_artistic = img_artistic.convert('RGB')
print("✅ Versão artística criada!")

# Adicionar logo
logo_path = "/home/user/webapp/frontend-public/public/images/flipcars-logo.jpg"
if os.path.exists(logo_path):
    logo = Image.open(logo_path)
    qr_width = img_artistic.size[0]
    logo_size = qr_width // 4
    logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    
    # Criar círculo branco de fundo
    mask = Image.new('L', (logo_size + 40, logo_size + 40), 0)
    draw_mask = ImageDraw.Draw(mask)
    draw_mask.ellipse([0, 0, logo_size + 40, logo_size + 40], fill=255)
    
    logo_bg = Image.new('RGB', (logo_size + 40, logo_size + 40), (255, 255, 255))
    logo_bg.paste(logo, (20, 20))
    
    # Aplicar borda suave
    logo_bg = logo_bg.filter(ImageFilter.SMOOTH)
    
    logo_pos = ((qr_width - logo_size - 40) // 2, (qr_width - logo_size - 40) // 2)
    img_artistic.paste(logo_bg, logo_pos, mask)
    print("✅ Logo FlipCars integrada!")

# Criar canvas circular
canvas_size = img_artistic.size[0] + 150
canvas = Image.new('RGB', (canvas_size, canvas_size), (255, 255, 255))
offset = (canvas_size - img_artistic.size[0]) // 2
canvas.paste(img_artistic, (offset, offset))

# Máscara circular suave
mask_circle = Image.new('L', (canvas_size, canvas_size), 0)
draw_circle = ImageDraw.Draw(mask_circle)
draw_circle.ellipse([20, 20, canvas_size-20, canvas_size-20], fill=255)

# Suavizar bordas
mask_circle = mask_circle.filter(ImageFilter.SMOOTH_MORE)

output1 = Image.new('RGBA', (canvas_size, canvas_size), (255, 255, 255, 0))
canvas_rgba = canvas.convert('RGBA')
output1.paste(canvas_rgba, (0, 0))
output1.putalpha(mask_circle)

output1.save("/home/user/webapp/flipcars_ARTISTIC_QR.png", quality=95)
print(f"✅ QR Code ARTÍSTICO salvo: {canvas_size}x{canvas_size}px")

# 2. VERSÃO COM CÍRCULOS COMPLETOS (ainda mais suave)
print("🎨 Criando versão com círculos completos...")

qr2 = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=20,
    border=4,
)
qr2.add_data(url)
qr2.make(fit=True)

img_circles = qr2.make_image(
    image_factory=StyledPilImage,
    module_drawer=CircleModuleDrawer(),
    color_mask=SolidFillColorMask(back_color=(212, 162, 89), front_color=(0, 0, 0))
)

img_circles = img_circles.convert('RGB')

# Adicionar logo
if os.path.exists(logo_path):
    logo2 = Image.open(logo_path)
    qr_width2 = img_circles.size[0]
    logo_size2 = qr_width2 // 4
    logo2 = logo2.resize((logo_size2, logo_size2), Image.Resampling.LANCZOS)
    
    mask2 = Image.new('L', (logo_size2 + 40, logo_size2 + 40), 0)
    draw_mask2 = ImageDraw.Draw(mask2)
    draw_mask2.ellipse([0, 0, logo_size2 + 40, logo_size2 + 40], fill=255)
    
    logo_bg2 = Image.new('RGB', (logo_size2 + 40, logo_size2 + 40), (255, 255, 255))
    logo_bg2.paste(logo2, (20, 20))
    logo_bg2 = logo_bg2.filter(ImageFilter.SMOOTH)
    
    logo_pos2 = ((qr_width2 - logo_size2 - 40) // 2, (qr_width2 - logo_size2 - 40) // 2)
    img_circles.paste(logo_bg2, logo_pos2, mask2)

# Canvas circular
canvas2 = Image.new('RGB', (canvas_size, canvas_size), (255, 255, 255))
canvas2.paste(img_circles, (offset, offset))

mask_circle2 = Image.new('L', (canvas_size, canvas_size), 0)
draw_circle2 = ImageDraw.Draw(mask_circle2)
draw_circle2.ellipse([20, 20, canvas_size-20, canvas_size-20], fill=255)
mask_circle2 = mask_circle2.filter(ImageFilter.SMOOTH_MORE)

output2 = Image.new('RGBA', (canvas_size, canvas_size), (255, 255, 255, 0))
canvas2_rgba = canvas2.convert('RGBA')
output2.paste(canvas2_rgba, (0, 0))
output2.putalpha(mask_circle2)

output2.save("/home/user/webapp/flipcars_CIRCLES_QR.png", quality=95)
print(f"✅ QR Code com CÍRCULOS salvo!")

# 3. VERSÃO COM ESPAÇAMENTO (gaps) - mais clean
print("🎨 Criando versão com espaçamento...")

qr3 = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=20,
    border=4,
)
qr3.add_data(url)
qr3.make(fit=True)

img_gapped = qr3.make_image(
    image_factory=StyledPilImage,
    module_drawer=GappedSquareModuleDrawer(),
    color_mask=SolidFillColorMask(back_color=(212, 162, 89), front_color=(0, 0, 0))
)

img_gapped = img_gapped.convert('RGB')

# Adicionar logo
if os.path.exists(logo_path):
    logo3 = Image.open(logo_path)
    qr_width3 = img_gapped.size[0]
    logo_size3 = qr_width3 // 4
    logo3 = logo3.resize((logo_size3, logo_size3), Image.Resampling.LANCZOS)
    
    mask3 = Image.new('L', (logo_size3 + 40, logo_size3 + 40), 0)
    draw_mask3 = ImageDraw.Draw(mask3)
    draw_mask3.ellipse([0, 0, logo_size3 + 40, logo_size3 + 40], fill=255)
    
    logo_bg3 = Image.new('RGB', (logo_size3 + 40, logo_size3 + 40), (255, 255, 255))
    logo_bg3.paste(logo3, (20, 20))
    logo_bg3 = logo_bg3.filter(ImageFilter.SMOOTH)
    
    logo_pos3 = ((qr_width3 - logo_size3 - 40) // 2, (qr_width3 - logo_size3 - 40) // 2)
    img_gapped.paste(logo_bg3, logo_pos3, mask3)

# Canvas circular
canvas3 = Image.new('RGB', (canvas_size, canvas_size), (255, 255, 255))
canvas3.paste(img_gapped, (offset, offset))

mask_circle3 = Image.new('L', (canvas_size, canvas_size), 0)
draw_circle3 = ImageDraw.Draw(mask_circle3)
draw_circle3.ellipse([20, 20, canvas_size-20, canvas_size-20], fill=255)
mask_circle3 = mask_circle3.filter(ImageFilter.SMOOTH_MORE)

output3 = Image.new('RGBA', (canvas_size, canvas_size), (255, 255, 255, 0))
canvas3_rgba = canvas3.convert('RGBA')
output3.paste(canvas3_rgba, (0, 0))
output3.putalpha(mask_circle3)

output3.save("/home/user/webapp/flipcars_GAPPED_QR.png", quality=95)
print(f"✅ QR Code com ESPAÇAMENTO salvo!")

print(f"\n🎨 RESUMO - 3 ESTILOS ARTÍSTICOS CRIADOS:")
print(f"   1. ARTISTIC (arredondado suave) - Estilo da referência")
print(f"   2. CIRCLES (círculos completos) - Mais orgânico")
print(f"   3. GAPPED (com espaçamento) - Clean e moderno")
print(f"   📐 Dimensão: {canvas_size}x{canvas_size}px cada")
print(f"   🔗 URL: {url}")

