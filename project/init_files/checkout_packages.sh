#!/bin/bash

RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
MAGENTA='\033[1;35m'
CYAN='\033[1;36m'
END='\033[0m'

git add $PACKAGE_FILES
git commit -m "updating package files" || true
CURRENT_WORKING_BRANCH=$(git branch --show-current)
git checkout main || (echo -e $RED"Something went wrong with checking out main, you might need to stash first, please fix first"$END && exit 1) || exit 1

git pull || (echo -e $RED"Something went wrong with pulling in main, possibly merge conflicts or smth, please fix first"$END && exit 1) || exit 1

git checkout $CURRENT_WORKING_BRANCH $PACKAGE_FILES
git add $PACKAGE_FILES
git commit -m "updating package files"
git push

git checkout $CURRENT_WORKING_BRANCH

