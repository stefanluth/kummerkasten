#!/bin/bash

_term() {
  kill -TERM "$child" 2>/dev/null
}

trap _term SIGTERM

UNLOCK_WORDS=3
DELETE_WORDS=6

export UNLOCK_PASSWORD=$(python3 utils/generate-passphrase.py $UNLOCK_WORDS)
export DELETE_PASSWORD=$(python3 utils/generate-passphrase.py $DELETE_WORDS)

echo $UNLOCK_PASSWORD >unlock-password
echo $DELETE_PASSWORD >delete-password

echo "===================================="
echo "Unlock password is:"
echo "===================================="
echo $UNLOCK_PASSWORD
echo "===================================="

echo "===================================="
echo "Delete password is:"
echo "===================================="
echo $DELETE_PASSWORD
echo "===================================="

npm run prepare:db
npm start &

child=$!
wait "$child"
