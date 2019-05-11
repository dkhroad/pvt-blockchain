#!/bin/bash

set -x
address=$1
message=$(./req_validation.sh $address)
signature=$(./sign_message.sh $address $message)
read -d '' post_message << EOF
{ 
  \"address\":\"$address\", 
  \"signature\":\"$signature\", 
  \"message\":\"$message\", 
  \"star\":{ 
    \"dec\":\"68° 52\' 56.9\\\"\",
    \"ra\": \"16h 29m 1.0s\",
    \"story\": \"Tesing the story 4\"
  } 
} 
EOF

sleep 5

echo $post_message > ./body.json
curl -s  -d @body.json -H "Content-Type: application/json"  http://localhost:8000/submitstar | jq
rm ./body.json




