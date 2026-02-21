from PIL import Image, ImageDraw, ImageFilter
import qrcode
import random
import math
import os

url = "https://www.flipcars.us"

# QR Code base
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=1,
    border=0,
)
qr.add_data(url)
qr.make(fit=True)
matrix = qr.get_matrix()
module_count = len(matrix)

# Configurações para design artístico
module_size = 45
canvas_size = 2000
qr_area_size = module_count * module_size
offset = (canvas_size - qr_area_size) // 2

# Criar canvas
img = Image.new('RGBA', (canvas_size, canvas_size), (255, 255, 255, 0))
draw = ImageDraw.Draw(img)

# Fundo circular dourado
draw.ellipse([0, 0, canvas_size, canvas_size], fill='#D4A259')

# Função para criar formas orgânicas mais elaboradas
def draw_artistic_module(draw, x, y, base_size):
    # Variação maior para efeito mais orgânico
    size_var = random.uniform(0.75, 1.25)
    radius = (base_size * size_var) / 2
    
    # Pequeno deslocamento aleatório
    x_off = random.uniform(-3, 3)
    y_off = random.uniform(-3, 3)
    
    x_adj = x + x_off
    y_adj = y + y_off
    
    # Desenhar círculo principal
    draw.ellipse(
        [x_adj - radius, y_adj - radius, x_adj + radius, y_adj + radius],
        fill='#000000'
    )
    
    # Adicionar "sombras" suaves para profundidade (50% das vezes)
    if random.random() > 0.5:
        shadow_offset = random.uniform(1, 3)
        shadow_radius = radius * 0.3
        draw.ellipse(
            [x_adj - shadow_radius + shadow_offset, 
             y_adj - shadow_radius + shadow_offset, 
             x_adj + shadow_radius + shadow_offset, 
             y_adj + shadow_radius + shadow_offset],
            fill=(0, 0, 0, 30)
        )

# Desenhar padrão com variação artística
for row in range(module_count):
    for col in range(module_count):
        if matrix[row][col]:
            x = offset + col * module_size + module_size // 2
            y = offset + row * module_size + module_size // 2
            draw_artistic_module(draw, x, y, module_size * 0.75)

print("✅ Padrão artístico orgânico criado!")

# Aplicar blur múltiplo para efeito suave
img = img.filter(ImageFilter.GaussianBlur(radius=1.5))

# Logo FlipCars
logo_path = "/home/user/webapp/frontend-public/public/images/flipcars-logo.jpg"
if os.path.exists(logo_path):
    logo = Image.open(logo_path).convert('RGBA')
    logo_size = canvas_size // 5
    logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    
    # Círculo branco com sombra suave
    circle_size = logo_size + 120
    circle = Image.new('RGBA', (circle_size, circle_size), (255, 255, 255, 0))
    circle_draw = ImageDraw.Draw(circle)
    
    # Sombra do círculo
    shadow_offset = 8
    circle_draw.ellipse(
        [shadow_offset, shadow_offset, circle_size, circle_size],
        fill=(0, 0, 0, 30)
    )
    
    # Círculo branco principal
    circle_draw.ellipse([0, 0, circle_size-shadow_offset, circle_size-shadow_offset], fill='white')
    
    # Aplicar blur na sombra
    circle = circle.filter(ImageFilter.GaussianBlur(radius=4))
    
    # Colar círculo
    circle_pos = ((canvas_size - circle_size) // 2, (canvas_size - circle_size) // 2)
    img.paste(circle, circle_pos, circle)
    
    # Colar logo
    logo_pos = ((canvas_size - logo_size) // 2, (canvas_size - logo_size) // 2)
    img.paste(logo, logo_pos, logo)
    
    print("✅ Logo com sombra adicionada!")

# Máscara circular
mask = Image.new('L', (canvas_size, canvas_size), 0)
mask_draw = ImageDraw.Draw(mask)
mask_draw.ellipse([15, 15, canvas_size-15, canvas_size-15], fill=255)

# Suavizar borda da máscara
mask = mask.filter(ImageFilter.GaussianBlur(radius=3))
img.putalpha(mask)

# Salvar
img.save("/home/user/webapp/flipcars_ULTRA_ARTISTIC_QR.png", quality=95)
print(f"✅ QR Code ULTRA ARTÍSTICO: {canvas_size}x{canvas_size}px")

# Versão em fundo branco (para impressão)
img_white_bg = Image.new('RGB', (canvas_size, canvas_size), 'white')
img_white_bg.paste(img, (0, 0), img)
img_white_bg.save("/home/user/webapp/flipcars_ULTRA_ARTISTIC_QR_white.png", quality=95)
print(f"✅ Versão com fundo branco criada!")

print(f"\n🎨 DESIGN ULTRA ARTÍSTICO:")
print(f"   ✨ Formas orgânicas fluidas")
print(f"   ✨ Variação natural intensa")
print(f"   ✨ Sombras suaves para profundidade")
print(f"   ✨ Blur artístico")
print(f"   ✨ Logo com sombra 3D")
print(f"   🔗 {url}")

