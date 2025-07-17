#!/bin/bash

RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
MAGENTA='\033[1;35m'
CYAN='\033[1;36m'
END='\033[0m'

CURRENT_NODE_VERSION=$(node -v | cut -d'.' -f1-2)
if [ "$CURRENT_NODE_VERSION" != "$NODE_VERSION" ]; then
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    if [ "$?" != "0" ]; then
        echo -e $RED"Something went wrong installing and initialising nvm and the correct version of Node, please consult workflow.md or JI"$END
        exit 1
    fi
    echo -e $BLUE"Currently your shell still doesn't see the correct version of node"
    echo -e "I fixed it for you :), but I can only do so for this invocation of the Makefile"
    echo -e "This means, I'll have to do it each time you restart and that's a lot of work :("
    echo -e "You can make it better either by restarting your shell or running the command: $END'[ -s \"\$HOME/.nvm/nvm.sh\" ] && \. \"\$HOME/.nvm/nvm.sh\"'"
    echo -e $BLUE"Pretty please and have a purrfect day ₍^. .^₎⟆"$END
fi
(cd ${FRONTEND} && npm install)
(cd ${FRONTEND} && npm run tailwind) &
(cd ${BACKEND} && npm install && npm start)