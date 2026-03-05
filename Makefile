# =========== Prod specific commands ===========

prod:
	docker compose -f docker-compose.prod.yml up -d --build

# =========== Build commands ===========

start:
	docker compose -f docker-compose.dev.yml up -d

down:
	docker compose down

restart: down dev

install:
	cd frontend && yarn install

ci:
	cd frontend && yarn install --frozen-lockfile

build:
	docker compose -f docker-compose.dev.yml up -d --build

front:
	cd frontend && yarn start

tunnel:
	cd frontend && yarn start --tunnel

# =========== Rebuild commands ===========

build-%:
	docker compose -f docker-compose.dev.yml up -d --build $*

build-nginx:
build-frontend:

# =========== Utility commands ===========

logs:
	docker compose logs -f

log-%:
	docker compose logs -f $*

log-nginx:
log-frontend:

ps:
	docker compose ps
