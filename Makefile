RED=\033[1;31m
GREEN=\033[1;32m
YELLOW=\033[1;33m
BLUE=\033[1;34m
MAGENTA=\033[1;35m
CYAN=\033[1;36m
END=\033[0m

CONTAINER_IDS := $(shell docker ps -qa)
DOCKER_VOLUMES := $(shell docker volume ls -q)
NGINX = ./srcs/requirements/nginx/
DOCKER_COMPOSE = ./srcs/docker-compose.yml
BACKEND_ENV_FILE = ./project/backend/.env
DATABASE_ENV_FILE = ./project/backend/database/prisma/.env
CERTS = ./project/backend/certs


all: environment
	docker-compose up --build

environment: ${BACKEND_ENV_FILE} ${DATABASE_ENV_FILE} ${CERTS}

${BACKEND_ENV_FILE}:
	@echo "${YELLOW}Please create a .env file in the project/backend directory${END}"
	@echo "${YELLOW}with the following content:${END}"
	@echo "${YELLOW}JWT_SECRET=[put secret here]${END}"
	exit 1

${DATABASE_ENV_FILE}:
	@echo "${YELLOW}Please create a .env file in the project/backend/database/prisma directory${END}"
	@echo "${YELLOW}with the following content:${END}"
	@echo "${YELLOW}DATABASE_URL=[name of database, in our case '../ft_transcendence.db']${END}"
	exit 1

${CERTS}:
	@echo "${YELLOW}Creating certificates...${END}"
	@mkdir -p ${CERTS}
	@openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout ${CERTS}/key.pem -out ${CERTS}/cert.pem \
		-subj "/C=NL/ST=Noord-Holland/L=Amsterdam/O=DeluluTeam/OU=CatDepatment/CN=transcendence"

stop:
	docker-compose down

clean:
	-docker stop $(CONTAINER_IDS)
	-docker builder prune -f && docker system prune -af
	-docker volume rm $(DOCKER_VOLUMES)

.PHONY: all environment stop clean