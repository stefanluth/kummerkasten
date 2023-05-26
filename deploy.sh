#!/bin/bash

WORDS=4
export UNLOCK_PASSWORD=$(curl -sSf "https://makemeapassword.ligos.net/api/v1/passphrase/plain?pc=1&wc=${WORDS}&maxCh=64" \
  | sed 's/ /-/g' | tr -d '\r')


echo "===================================="
echo "Password is:"
echo "===================================="
echo $UNLOCK_PASSWORD
echo "===================================="

docker-compose up
