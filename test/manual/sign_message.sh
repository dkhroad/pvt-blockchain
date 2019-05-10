#!/bin/bash

set -x
address=$1
message=$2
electrum='/Applications/Electrum.app/Contents/MacOS/Electrum'

$electrum signmessage $address $message -W "$ELECTRUM_PASSWORD"


