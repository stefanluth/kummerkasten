#!/bin/bash

_term() { 
  kill -TERM "$child" 2>/dev/null
}

trap _term SIGTERM

UNLOCK_WORDS=3

export UNLOCK_PASSWORD=$(python3 utils/generate-passphrase.py $UNLOCK_WORDS)

echo $UNLOCK_PASSWORD > unlock-password

echo "===================================="
echo "Unlock password is:"
echo "===================================="
echo $UNLOCK_PASSWORD
echo "===================================="

npm run prepare:db
npm start &

child=$!
wait "$child"
