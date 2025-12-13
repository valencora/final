#!/bin/bash

echo "🚀 Construyendo y sirviendo la aplicación PWA..."
echo ""

# Verificar que el backend esté corriendo
echo "📡 Verificando conexión con el backend..."
if curl -s http://localhost:8080/ > /dev/null 2>&1; then
    echo "✅ Backend está corriendo en http://localhost:8080"
else
    echo "⚠️  Backend no está disponible en http://localhost:8080"
    echo "   Por favor, inicia el backend primero:"
    echo "   docker compose -f docker/compose/docker-compose.yml up -d"
    echo ""
    read -p "¿Continuar de todos modos? (s/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[SsYy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "🔨 Construyendo la aplicación en modo producción (PWA)..."
echo "   Esto puede tardar 1-2 minutos"
echo ""

# Construir la aplicación
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error al construir la aplicación"
    exit 1
fi

echo ""
echo "✅ Construcción completada"
echo ""
echo "🌐 Sirviendo la aplicación PWA..."
echo "   La aplicación estará disponible en: http://localhost:4200"
echo "   El Service Worker estará activo para funcionar offline"
echo ""
echo "💡 Para probar el modo offline:"
echo "   1. Carga la aplicación en el navegador"
echo "   2. Espera a que carguen los blogs"
echo "   3. Desactiva tu conexión a internet"
echo "   4. Recarga la página - deberías ver los blogs desde la caché"
echo ""

# Servir la aplicación construida
npx http-server dist/blog-app-ionic -p 4200 -c-1 --cors

