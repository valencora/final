#!/usr/bin/env python3
"""
Script para generar iconos PNG simples para la PWA
"""
from PIL import Image, ImageDraw, ImageFont
import os

ICON_DIR = "src/assets/icon"
SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

# Asegurar que el directorio existe
os.makedirs(ICON_DIR, exist_ok=True)

print("Generando iconos para la PWA...")

for size in SIZES:
    try:
        # Crear imagen con fondo azul (#317efb)
        img = Image.new('RGB', (size, size), color='#317efb')
        draw = ImageDraw.Draw(img)
        
        # Intentar agregar texto "BA"
        font_size = size // 3
        text = "BA"
        
        try:
            # Intentar usar fuente del sistema
            font_paths = [
                "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
                "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
                "/System/Library/Fonts/Helvetica.ttc",
            ]
            font = None
            for font_path in font_paths:
                if os.path.exists(font_path):
                    font = ImageFont.truetype(font_path, font_size)
                    break
            
            if font is None:
                font = ImageFont.load_default()
            
            # Calcular posición centrada
            bbox = draw.textbbox((0, 0), text, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            position = ((size - text_width) // 2, (size - text_height) // 2 - bbox[1])
            
            draw.text(position, text, fill='white', font=font)
        except Exception as e:
            print(f"  Nota: No se pudo agregar texto al icono {size}x{size}: {e}")
        
        # Guardar
        output_path = f"{ICON_DIR}/icon-{size}x{size}.png"
        img.save(output_path, 'PNG')
        print(f"✅ Icono {size}x{size} generado: {output_path}")
        
    except Exception as e:
        print(f"❌ Error al generar icono {size}x{size}: {e}")

print("\n✅ Proceso completado!")

