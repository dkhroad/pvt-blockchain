#!/bin/sh

set -x
address=$1
curl -s http://localhost:8000/blocks/$address | jq

