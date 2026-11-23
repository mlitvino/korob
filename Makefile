.PHONY: install ci test test-design format format-check lint-compile migrations-check front tunnel preview up down logs ps

# =========== Frontend ===========

install:
	cd frontend && yarn install

ci:
	cd frontend && yarn install --frozen-lockfile

test:
	cd frontend && yarn test

test-design:
	cd frontend && yarn test:design

# Until dprint is in package.json (see local/plan.md) it runs through npx.
DPRINT ?= npx --yes dprint@0.65.0

format:
	cd frontend && $(DPRINT) fmt

format-check:
	cd frontend && $(DPRINT) check

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
