#!/bin/bash

# Mata todos os processos Node.js (inclui http-server)
ps aux | grep node | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null

# Aguarda a liberação da porta 3171
echo "Aguardando liberação da porta 3171..."
while lsof -i :3171 | grep LISTEN; do
  sleep 1
done

echo "Subindo http-server na porta 3171..."
npx http-server -p 3171 --cors 