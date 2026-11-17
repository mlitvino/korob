# =========== Prod specific commands ===========

prod:
	docker compose -f docker-compose.prod.yml up -d --build

# =========== Build commands ===========

start:
	docker compose -f docker-compose.dev.yml up -d

down:
	docker compose down

restart: down start

install:
	cd frontend && yarn install

ci:
	cd frontend && yarn install --frozen-lockfile

test:
	cd frontend && yarn test

lint-compile:
	cd frontend && yarn lint && yarn tsc

# Fails when schema.ts changed without a generated migration.
migrations-check:
	cd frontend && yarn -s migration:generate
	@cd frontend && git status --porcelain src/db/migrations | (! grep .) \
		|| (echo "Schema changed without a migration: run 'yarn migration:generate' and commit it." && exit 1)

build:
	docker compose -f docker-compose.dev.yml up -d --build

front:
	cd frontend && yarn start

tunnel:
	cd frontend && yarn start --tunnel

preview:
	cd frontend && eas build --profile preview --platform android

# =========== Rebuild commands ===========

build-%:
	docker compose -f docker-compose.dev.yml up -d --build $*

build-nginx:

# =========== Utility commands ===========

logs:
	docker compose logs -f

log-%:
	docker compose logs -f $*

log-nginx:

ps:
	docker compose ps
