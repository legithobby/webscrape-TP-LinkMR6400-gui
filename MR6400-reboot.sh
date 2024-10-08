#!/usr/bin/env bash

# Get the directory of the script
SCRIPT_DIR="$(dirname "$0")"

cd $SCRIPT_DIR

./runpuppedocker.sh MR6400-reboot.js

