Componente	Comando
Tests de unidad	cd backend && mvn clean test
Backend + Servicios	docker compose -f docker/compose/docker-compose.yml up -d
Tests E2E	cd backend && npx cypress open
Frontend Ionic	cd ionic-app && npm run start:pwa
Detener Docker	docker compose -f docker/compose/docker-compose.yml down





