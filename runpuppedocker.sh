#!/usr/bin/env bash

if [ $# -lt 1 ]
then
  echo "Usage $0 puppeteerscript.js"
  exit
fi

# Get the directory of the script
SCRIPT_DIR="$(dirname "$0")"

cd $SCRIPT_DIR


# In .env file there is username and password for MR6400 web gui
# puppeteer js script will read username and password from env variables with const USER = process.env.USER;

ENVFILE="./.env"
SCRAPEURL=http://192.168.1.1/  # Address of MR6400 router
# SYS_ADMIN capabilities are needed to set up chromium into sandbox
# several unnecessary capabilities are removed ( --cap-drop )

MAPPEDSCRIPTDIR="/home/pptruser/mappedscripts"

docker run --init \
  --cap-add=SYS_ADMIN \
  --cap-drop=NET_ADMIN \
  --cap-drop=SYS_MODULE \
  --cap-drop=SYS_PTRACE \
  --cap-drop=SYS_BOOT \
  --cap-drop=SYS_TIME \
  --cap-drop=MKNOD \
  --cap-drop=SYS_TTY_CONFIG \
  --name puppe01 \
  --rm  --user 999:1000 \
  --env-file "$ENVFILE" \
  -e TZ=Europe/Helsinki \
  -e SCRAPEURL="$SCRAPEURL" \
  -v "$PWD/js/:$MAPPEDSCRIPTDIR" \
  -v "$PWD/output:/home/app" \
  ghcr.io/puppeteer/puppeteer:latest \
  node "$MAPPEDSCRIPTDIR/$1"

