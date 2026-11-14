COMPOSE := docker compose -f compose.dev.yaml

.DEFAULT_GOAL := help
.PHONY: help install dev api build start typecheck lint doctor domain check up down logs shell rebuild clean

help: ## List available targets
	@grep -E '^[a-z-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "} {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

dev: ## Run the dev server on :3000
	npm run dev

api: ## Regenerate src/client from the backend at localhost:8000
	npm run generate:api

build: ## Build for production
	npm run build

start: build ## Serve the production build locally
	npm run start

typecheck: ## Run the TypeScript compiler
	npm run typecheck

lint: ## Run next lint
	npm run lint

doctor: ## Analyze React code with react-doctor
	npx -y react-doctor@latest

domain: ## Run assert-based domain checks (*.check.ts)
	find src -name "*.check.ts" -exec npx -y tsx@4 {} \;

check: typecheck domain build doctor ## Run all quality gates

up: ## Start the dev container on :3000
	$(COMPOSE) up -d --build

down: ## Stop the dev container
	$(COMPOSE) down

logs: ## Follow dev container logs
	$(COMPOSE) logs -f web

shell: ## Open a shell in the dev container
	$(COMPOSE) exec web sh

rebuild: ## Rebuild the dev image and reinstall dependencies
	$(COMPOSE) down -v
	$(COMPOSE) up -d --build

clean: ## Remove build output
	rm -rf .next
