#!/bin/bash
# Script para solucionar problemas de acceso a Kibana cuando Elasticsearch bloquea los índices
# Uso: ./scripts/fix-kibana.sh

set -e

echo "🔍 Verificando estado de Elasticsearch..."
ELASTICSEARCH_URL="http://localhost:9200"

# Verificar si Elasticsearch está disponible
if ! curl -s "$ELASTICSEARCH_URL/_cluster/health" > /dev/null; then
    echo "❌ Error: Elasticsearch no está disponible en $ELASTICSEARCH_URL"
    echo "   Asegúrate de que los contenedores estén corriendo:"
    echo "   docker compose -f docker/compose/docker-compose.yml ps"
    exit 1
fi

echo "✅ Elasticsearch está disponible"

# Desbloquear índices si están bloqueados
echo ""
echo "🔓 Desbloqueando índices..."
curl -X PUT "$ELASTICSEARCH_URL/_all/_settings?pretty" \
  -H 'Content-Type: application/json' \
  -d'{"index.blocks.read_only_allow_delete": null}' > /dev/null 2>&1

echo "✅ Índices desbloqueados"

# Configurar watermarks para prevenir futuros bloqueos
echo ""
echo "⚙️  Configurando watermarks de disco..."
curl -X PUT "$ELASTICSEARCH_URL/_cluster/settings?pretty" \
  -H 'Content-Type: application/json' \
  -d'{
    "persistent": {
      "cluster.routing.allocation.disk.watermark.low": "90%",
      "cluster.routing.allocation.disk.watermark.high": "92%",
      "cluster.routing.allocation.disk.watermark.flood_stage": "94%"
    }
  }' > /dev/null 2>&1

echo "✅ Watermarks configurados"

# Mostrar estado del disco
echo ""
echo "📊 Estado del disco:"
curl -s "$ELASTICSEARCH_URL/_cat/allocation?v"

echo ""
echo "🎉 ¡Problema resuelto! Intenta acceder a Kibana en http://localhost:5601"
echo ""
echo "💡 Si el problema persiste, considera liberar espacio en disco:"
echo "   - Eliminar índices antiguos: curl -X DELETE '$ELASTICSEARCH_URL/blog-app-logs-YYYY.MM.DD'"
echo "   - Limpiar volúmenes Docker: docker system prune -a --volumes"

