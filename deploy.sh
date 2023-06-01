#!/bin/bash

WORDS=4
export UNLOCK_PASSWORD=$(python3 utils/generate-passphrase.py $WORDS)

echo "===================================="
echo "Password is:"
echo "===================================="
echo $UNLOCK_PASSWORD
echo "===================================="

docker-compose up
