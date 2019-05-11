#!/bin/sh

set -x
curl -s http://localhost:8000/block/0 | jq
