import qrcode
from PIL import Image, ImageDraw
import os

# URL para o QR Code
url = "https://www.flipcars.us"

# 1. Criar QR Code base
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=1,
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

# Obter matriz do QR Code
matrix = qr.get_matrix()
module_count = len(matrix)

# Configurações de design
module_size = 30  # Tamanho de cada "círculo/módulo"
border = 4
qr_size = (module_count + border * 2) * module_size

# Criar imagem com fundo dourado
img = Image.new('RGB', (qr_size, qr_size), '#D4A259')
draw = ImageDraw.Draw(img)

# Desenhar cada módulo como CÍRCULO ao invés de quadrado
for row in range(module_count):
    for col in range(module_count):
        if matrix[row][col]:
            # Calcular posição central do módulo
            x = (col + border) * module_size + module_size // 2
            y = (row + border) * module_size + module_size // 2
            
            # Desenhar CÍRCULO PRETO (não quadrado!)
            radius = module_size // 2.5  # Círculos menores para não se sobrepor
            draw.ellipse(
                [x - radius, y - radius, x + radius, y + radius],
                fill='#000000'
            )

print("✅ QR Code com módulos CIRCULARES criado!")

# 2. Adicionar logo da FlipCars no centro
logo_path = "/home/user/webapp/frontend-public/public/images/flipcars-logo.jpg"
if os.path.exists(logo_path):
    logo = Image.open(logo_path)
    
    # Redimensionar logo
    logo_size = qr_size // 5
    logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    
    # Criar fundo branco redondo para o logo
    logo_bg_size = logo_size + 40
    logo_bg = Image.new('RGB', (logo_bg_size, logo_bg_size), '#D4A259')
    draw_logo = ImageDraw.Draw(logo_bg)
    
    # Desenhar círculo branco de fundo
    draw_logo.ellipse([0, 0, logo_bg_size, logo_bg_size], fill='white')
    
    # Colar logo no centro do círculo branco
    logo_bg.paste(logo, (20, 20))
    
    # Calcular posição central
    logo_pos = ((qr_size - logo_bg_size) // 2, (qr_size - logo_bg_size) // 2)
    
    # Colar logo no QR Code
    img.paste(logo_bg, logo_pos)
    print("✅ Logo FlipCars adicionada!")

# 3. Criar canvas maior com formato CIRCULAR completo
canvas_size = qr_size + 200
canvas = Image.new('RGB', (canvas_size, canvas_size), 'white')

# Colar QR Code no centro
offset = (canvas_size - qr_size) // 2
canvas.paste(img, (offset, offset))

# Criar máscara CIRCULAR para todo o QR Code
mask = Image.new('L', (canvas_size, canvas_size), 0)
draw_mask = ImageDraw.Draw(mask)
draw_mask.ellipse([30, 30, canvas_size-30, canvas_size-30], fill=255)

# Aplicar máscara circular
output = Image.new('RGBA', (canvas_size, canvas_size), (255, 255, 255, 0))
canvas_rgba = canvas.convert('RGBA')
output.paste(canvas_rgba, (0, 0))
output.putalpha(mask)

output.save("/home/user/webapp/flipcars_MODERN_ROUND_QR.png", quality=95)
print(f"✅ QR Code MODERNO REDONDO criado: {canvas_size}x{canvas_size}px")

# 4. Versão com borda DOURADA (para impressão)
canvas_gold = Image.new('RGB', (canvas_size, canvas_size), '#D4A259')
canvas_gold.paste(img, (offset, offset))

# Criar versão com borda dourada grossa
mask_gold = Image.new('L', (canvas_size, canvas_size), 0)
draw_gold = ImageDraw.Draw(mask_gold)
draw_gold.ellipse([20, 20, canvas_size-20, canvas_size-20], fill=255)

output_gold = Image.new('RGBA', (canvas_size, canvas_size), (212, 162, 89, 255))
canvas_gold_rgba = canvas_gold.convert('RGBA')
output_gold.paste(canvas_gold_rgba, (0, 0))
output_gold.putalpha(mask_gold)

output_gold.save("/home/user/webapp/flipcars_MODERN_ROUND_QR_gold.png", quality=95)
print(f"✅ QR Code MODERNO REDONDO (dourado) criado!")

# 5. Versão GRANDE (para impressão grande)
module_size_large = 50
qr_size_large = (module_count + border * 2) * module_size_large
img_large = Image.new('RGB', (qr_size_large, qr_size_large), '#D4A259')
draw_large = ImageDraw.Draw(img_large)

# Desenhar círculos grandes
for row in range(module_count):
    for col in range(module_count):
        if matrix[row][col]:
            x = (col + border) * module_size_large + module_size_large // 2
            y = (row + border) * module_size_large + module_size_large // 2
            radius = module_size_large // 2.5
            draw_large.ellipse(
                [x - radius, y - radius, x + radius, y + radius],
                fill='#000000'
            )

# Adicionar logo grande
if os.path.exists(logo_path):
    logo_large = Image.open(logo_path)
    logo_size_large = qr_size_large // 5
    logo_large = logo_large.resize((logo_size_large, logo_size_large), Image.Resampling.LANCZOS)
    logo_bg_large = Image.new('RGB', (logo_size_large + 60, logo_size_large + 60), '#D4A259')
    draw_logo_l = ImageDraw.Draw(logo_bg_large)
    draw_logo_l.ellipse([0, 0, logo_size_large + 60, logo_size_large + 60], fill='white')
    logo_bg_large.paste(logo_large, (30, 30))
    logo_pos_large = ((qr_size_large - logo_size_large - 60) // 2, (qr_size_large - logo_size_large - 60) // 2)
    img_large.paste(logo_bg_large, logo_pos_large)

# Canvas grande circular
canvas_large_size = qr_size_large + 300
canvas_large = Image.new('RGB', (canvas_large_size, canvas_large_size), 'white')
offset_large = (canvas_large_size - qr_size_large) // 2
canvas_large.paste(img_large, (offset_large, offset_large))

mask_large = Image.new('L', (canvas_large_size, canvas_large_size), 0)
draw_mask_l = ImageDraw.Draw(mask_large)
draw_mask_l.ellipse([40, 40, canvas_large_size-40, canvas_large_size-40], fill=255)

output_large = Image.new('RGBA', (canvas_large_size, canvas_large_size), (255, 255, 255, 0))
canvas_large_rgba = canvas_large.convert('RGBA')
output_large.paste(canvas_large_rgba, (0, 0))
output_large.putalpha(mask_large)

output_large.save("/home/user/webapp/flipcars_MODERN_ROUND_QR_LARGE.png", quality=95)
print(f"✅ QR Code MODERNO REDONDO GRANDE criado: {canvas_large_size}x{canvas_large_size}px")

print(f"\n📊 RESUMO:")
print(f"   ✅ Módulos internos: CÍRCULOS (não quadrados!)")
print(f"   ✅ Formato externo: REDONDO")
print(f"   ✅ Logo: FlipCars integrada")
print(f"   ✅ Dimensões: {canvas_size}x{canvas_size}px (normal), {canvas_large_size}x{canvas_large_size}px (grande)")
print(f"   🔗 URL: {url}")

