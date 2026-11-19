.PHONY: install ci test lint-compile migrations-check front tunnel preview up down logs ps

# =========== Frontend ===========

install:
	cd frontend && yarn install

ci:
	cd frontend && yarn install --frozen-lockfile

test:
	cd frontend && yarn test

lint-compile:
	cd frontend && yarn lint && yarn tsc

migrations-check:
	cd frontend && yarn -s migration:generate
	@cd frontend && git status --porcelain src/db/migrations | (! grep .) \
		|| (echo "Schema changed without a migration: run 'yarn migration:generate' and commit it." && exit 1)

front:
	cd frontend && yarn start

tunnel:
	cd frontend && yarn start --tunnel

preview:
	cd frontend && eas build --profile preview --platform android

# =========== Local server stack (compose.yml) ===========

up:
	docker compose up -d --build --wait

down:
	docker compose down

logs:
	docker compose logs -f

ps:
	docker compose ps
