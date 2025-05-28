#!/bin/bash

RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
MAGENTA='\033[1;35m'
CYAN='\033[1;36m'
END='\033[0m'



create_package_json() {
    echo -e $RED"\nNo backend package.json detected, initialising"$END
    echo -e "Would you like to download the package.json from the main branch of the repository? (recommended) Type 1"
    echo -e "Or initialise a completely new package.json? Type 2"
    read option
    while [[ "$option" != "1" && "$option" != "2" ]]; do
        echo "Please enter a valid option, (1 or 2)"
        read option
    done
    if [[ "$option" = "1" ]]; then
        curl https://raw.githubusercontent.com/akrepkov/transcendence/refs/heads/main/project/backend/package.json > package.json
        curl https://raw.githubusercontent.com/akrepkov/transcendence/refs/heads/main/project/backend/package-lock.json > package-lock.json
    else    
        npm init -y
        awk '{
        print
        if ($0 ~ /"main"\s*:/ && !found) {
            print "  \"type\": \"module\","
            found = 1
        }
        }' package.json > tmp.json && mv tmp.json package.json
        awk '{
        print
        if ($0 ~ /"scripts"\s*:/ && !found) {
            print "    \"start\": \"concurrently \\\"nodemon index.js\\\" \\\"python3 liveDatabase.py\\\"\","

            found = 1
        }
        }' package.json > tmp.json && mv tmp.json package.json
        npm pkg set scripts.lint="eslint ."
        npm pkg set scripts.lint:fix="eslint . --fix"
        npm pkg set scripts.prepare="cd ../.. && husky"
    fi
}

get_packages() {
    awk -v target="$1" '
    found { if ($0 == "") exit; print }
    $0 ~ target { found = 1 }
    ' $PACKAGE_FILE_PATH
}

CURRENT_NODE_VERSION=$(node -v | cut -d'.' -f1-2)
if [ "$CURRENT_NODE_VERSION" != "$NODE_VERSION" ]; then
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    if [ "$?" != "0" ]; then
        echo -e $RED"Something went wrong installing and initialising nvm and the correct version of Node, please consult troubleshooting.txt or JI"$END
        exit
    fi
fi

cd $BACKEND

if [ -f "./package.json" ]; then
    NEED_NPM_INIT=false
else
    NEED_NPM_INIT=true
fi

if [ -d "./node_modules" ]; then
    NEED_INSTALL_MODULES=false
else
    NEED_INSTALL_MODULES=true
fi

if [ "$NEED_NPM_INIT" = true ]; then
    create_package_json
    NEED_INSTALL_MODULES=true
fi

if [ "$NEED_INSTALL_MODULES" = true ]; then
    echo -e $RED"\nDetected the need to install modules, installing ..."$END
    if [ "$option" = 2 ]; then
        npm install $(get_packages "backend_dependencies" )
        npm install $(get_packages "backend_dev_dependencies") --save-dev
        echo -e $GREEN"\nBackend initialised (hopefully succesfully)"$END
    else
        npm install
        echo -e $GREEN"\nBackend initialised (hopefully succesfully)"$END
    fi
    
fi

if [[ "$NEED_NPM_INIT" = false && "$NEED_INSTALL_MODULES" = false ]]; then
    echo -e $GREEN"\nBackend already initialised\n"$END
fi

