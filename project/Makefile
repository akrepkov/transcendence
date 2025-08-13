RED=\033[1;31m
GREEN=\033[1;32m
YELLOW=\033[1;33m
BLUE=\033[1;34m
MAGENTA=\033[1;35m
CYAN=\033[1;36m
END=\033[0m

export BACKEND := ./backend
export FRONTEND := ./frontend
export NVM_DIR = ${HOME}/.nvm
export PACKAGE_FILE_PATH=${PWD}/packages.txt
export PACKAGE_FILES = ${PACKAGE_FILE_PATH} ${PWD}/${BACKEND}/package.json ${PWD}/${BACKEND}/package-lock.json ${PWD}/${FRONTEND}/package.json ${PWD}/${FRONTEND}/package-lock.json
export NODE_VERSION=v23.11

# scripts
NODE_INIT=./init_files/node_init.sh
BACKEND_INIT = ./init_files/backend_init.sh
FRONTEND_INIT = ./init_files/frontend_init.sh
STARTUP_SCRIPT = ./init_files/startup.sh
PACKAGE_SCRIPT = ./init_files/checkout_packages.sh
PRODUCTION_SCRIPT = ./init_files/production.sh

RM=rm -rf

all: dev

production: node backend frontend
	@echo "${GREEN}Running production script...${END}"
	@${PRODUCTION_SCRIPT}

# starts in dev mode, will start server with nodemon, so it monitors changes to files and restarts automatically
dev: node backend frontend
	@${STARTUP_SCRIPT}

# calls script that makes sure the right version of node is being used
node:
	@echo "${YELLOW}Checking and initialising Node...${END}"
	@${NODE_INIT}

# initialises package.json and installs modules if they aren't already there
backend:
	@echo "${YELLOW}Checking and initialising the backend...${END}"
	@${BACKEND_INIT}

frontend:
	@echo "${YELLOW}Checking and initialising the frontend...${END}"
	@${FRONTEND_INIT}

# cleanup node_modules, dist, test-results and playwright-report
clean:
	@${RM} ${BACKEND}/node_modules
	@${RM} ${FRONTEND}/node_modules
	@${RM} ${FRONTEND}/dist
	@${RM} ${FRONTEND}/test-results
	@${RM} ${FRONTEND}/playwright-report

lint:
	@echo "${YELLOW}Linting the backend...${END}"
	@cd ${BACKEND} && npm run lint || true
	@echo "${YELLOW}Linting the frontend...${END}"
	@cd ${FRONTEND} && npm run lint || true

lint-fix:
	@echo "${YELLOW}Linting and fixing the backend...${END}"
	@cd ${BACKEND} && npm run lint:fix || true
	@echo "${YELLOW}Linting and fixing the frontend...${END}"
	@cd ${FRONTEND} && npm run lint:fix || true

# cleanup package.json as well
reset: clean
	@${RM} ~/.nvm
	@${RM} ${BACKEND}/package.json
	@${RM} ${BACKEND}/package-lock.json
	@${RM} ${FRONTEND}/package.json
	@${RM} ${FRONTEND}/package-lock.json

update_json:
	@echo "${YELLOW}Updating packages...${END}"
	@${PACKAGE_SCRIPT}

re: clean dev

.PHONY: all dev clean re reset backend frontend node production lint lint-fix

