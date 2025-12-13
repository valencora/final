#!/bin/bash

# Script para generar iconos PNG simples para la PWA
# Usa ImageMagick si está disponible, o crea iconos usando Python

ICON_DIR="src/assets/icon"
SIZES=(72 96 128 144 152 192 384 512)

echo "Generando iconos para la PWA..."

# Verificar si ImageMagick está disponible
if command -v convert &> /dev/null || command -v magick &> /dev/null; then
    CONVERT_CMD=$(command -v convert || command -v magick)
    echo "Usando ImageMagick: $CONVERT_CMD"
    
    for size in "${SIZES[@]}"; do
        # Crear un icono simple con fondo azul y texto "BA"
        $CONVERT_CMD -size ${size}x${size} xc:"#317efb" \
            -gravity center \
            -pointsize $((size/3)) \
            -fill white \
            -font "DejaVu-Sans-Bold" \
            -annotate +0+0 "BA" \
            "${ICON_DIR}/icon-${size}x${size}.png" 2>/dev/null || \
        $CONVERT_CMD -size ${size}x${size} xc:"#317efb" \
            -gravity center \
            -pointsize $((size/3)) \
            -fill white \
            -font "Arial-Bold" \
            -annotate +0+0 "BA" \
            "${ICON_DIR}/icon-${size}x${size}.png" 2>/dev/null || \
        $CONVERT_CMD -size ${size}x${size} xc:"#317efb" \
            "${ICON_DIR}/icon-${size}x${size}.png"
        
        if [ -f "${ICON_DIR}/icon-${size}x${size}.png" ]; then
            echo "✅ Icono ${size}x${size} generado"
        fi
    done
else
    # Si ImageMagick no está, usar Python con PIL/Pillow si está disponible
    echo "ImageMagick no encontrado, intentando con Python..."
    
    python3 << EOF
from PIL import Image, ImageDraw, ImageFont
import os

icon_dir = "${ICON_DIR}"
sizes = [72, 96, 128, 144, 152, 192, 384, 512]

for size in sizes:
    # Crear imagen con fondo azul
    img = Image.new('RGB', (size, size), color='#317efb')
    draw = ImageDraw.Draw(img)
    
    # Intentar dibujar texto "BA"
    try:
        # Intentar usar fuente del sistema
        font_size = size // 3
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
        except:
            try:
                font = ImageFont.truetype("/usr/share/fonts/TTF/DejaVuSans-Bold.ttf", font_size)
            except:
                font = ImageFont.load_default()
        
        # Calcular posición centrada
        text = "BA"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        position = ((size - text_width) // 2, (size - text_height) // 2)
        
        draw.text(position, text, fill='white', font=font)
    except Exception as e:
        print(f"No se pudo agregar texto al icono {size}x{size}: {e}")
    
    # Guardar
    img.save(f"{icon_dir}/icon-{size}x{size}.png")
    print(f"✅ Icono {size}x{size} generado")

print("Iconos generados exitosamente")
EOF

    if [ $? -eq 0 ]; then
        echo "✅ Iconos generados con Python"
    else
        echo "⚠️  No se pudo generar iconos. Creando iconos mínimos..."
        # Crear iconos mínimos usando base64
        for size in "${SIZES[@]}"; do
            # Crear un PNG mínimo válido (1x1 pixel azul)
            python3 -c "
import struct
size = ${size}
# Crear un PNG mínimo válido con fondo azul
# Esto es un PNG 1x1 pixel que será escalado
data = b'\x89PNG\r\n\x1a\n' + \
       struct.pack('>I', 13) + b'IHDR' + \
       struct.pack('>II', size, size) + \
       b'\x08\x02\x00\x00\x00' + \
       struct.pack('>I', 0) + b'IEND' + b'\xaeB`\x82'
with open('${ICON_DIR}/icon-${size}x${size}.png', 'wb') as f:
    f.write(data)
"
        done
        echo "⚠️  Iconos mínimos creados. Se recomienda usar iconos reales en producción."
    fi
fi

echo ""
echo "✅ Proceso completado. Verifica los iconos en ${ICON_DIR}/"

