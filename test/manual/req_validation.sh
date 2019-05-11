#!/bin/bash
set -x
address=$1
curl -s -d "{\"address\":\"$address\"}" -H "Content-Type: application/json" -X POST http://localhost:8000/requestValidation | sed -e 's/\"//g'
