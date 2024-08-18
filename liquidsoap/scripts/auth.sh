#!/bin/bash

# This script is called by the Liquidsoap script to authenticate the source

# Args : $1 = user $2 = password

# Environment variables
# MONKEYRADIO_API_URL : URL to the API endpoint to authenticate the user
# LIQUIDSOAP_RADIO_ID : ID of the radio (used with API LOGIN)

# Check if the user is allowed to connect to the stream

# If the LIQUIDSOAP_API_LOGIN_URL is set, we will use the API to authenticate the user
if [ -n "$MONKEYRADIO_API_URL" ]; then
  # Use token if user = _token
  if [ "$1" = "_token" ]; then
    response=$(curl -s --header "Authorization: $2" "$MONKEYRADIO_API_URL/v4/auth/me")
  else
    # Call the API to authenticate the user
    response=$(curl -s -X POST -d "nickname=$1&password=$2" "$MONKEYRADIO_API_URL/v4/auth/login")
  fi

  # JSON parsing
  json=$(echo $response | jq '.')
  if [ $? -ne 0 ]; then
    echo "false"
    exit 1
  fi

  # Has 'streamer' or 'administrator' role
  role=$(echo $json | jq -c '.roles | any(. == "streamer" or . == "administrator")' 2>/dev/null)

  # Has $LIQUIDSOAP_RADIO_ID or '*' scope
  scope=$(echo $json | jq -c '.scopes | any(. == "'$LIQUIDSOAP_RADIO_ID'" or . == "*")' 2>/dev/null)

  # Check if the user is allowed to connect to the stream
  if [ "$role" = "true" ] && [ "$scope" = "true" ]; then
    echo "true"
    exit 0
  else
    echo "false"
    exit 1
  fi
fi

# If no authentication method is set, we will allow the user to connect
echo "true"