#!/bin/sh

set -x
address=$1
curl http://localhost:8000/blocks/$address

