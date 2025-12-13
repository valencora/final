#!/bin/bash

echo "🚀 Iniciando aplicación Ionic PWA..."
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
echo "🔨 Iniciando servidor de desarrollo..."
echo "   Esto puede tardar 30-60 segundos en la primera compilación"
echo "   La aplicación estará disponible en: http://localhost:4200"
echo ""

npm start

