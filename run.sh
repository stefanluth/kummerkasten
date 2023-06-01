#!/bin/bash

UNLOCK_WORDS=3

export UNLOCK_PASSWORD=$(python3 utils/generate-passphrase.py $UNLOCK_WORDS)


echo "===================================="
echo "Unlock password is:"
echo "===================================="
echo $UNLOCK_PASSWORD
echo "===================================="

npm start
