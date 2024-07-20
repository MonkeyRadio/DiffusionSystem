#!/bin/bash

# Liquidsoap entrypoint


# Creds extraction from env
# envs variable list
# LIQUIDSOAP_RADIO_ID
# LIQUIDSOAP_API_LOGIN_URL
# ICE_OUTPUT_HOST
# ICE_OUTPUT_PORT
# ICE_OUTPUT_SOURCE_PASSWORD

# Check if all the required env variables are set
if [ -z "$LIQUIDSOAP_RADIO_ID" ]; then
  echo "LIQUIDSOAP_RADIO_ID is missing"
  exit 1
fi

if [ -z "$LIQUIDSOAP_PROGRAM_NAME" ]; then
  echo "LIQUIDSOAP_PROGRAM_NAME is missing"
  exit 1
fi

if [ -z "$LIQUIDSOAP_API_LOGIN_URL" ]; then
  echo "LIQUIDSOAP_API_LOGIN_URL is missing"
  exit 1
fi

if [ -z "$ICE_OUTPUT_HOST" ]; then
  echo "ICE_OUTPUT_HOST is missing"
  exit 1
fi

if [ -z "$ICE_OUTPUT_PORT" ]; then
  echo "ICE_OUTPUT_PORT is missing"
  exit 1
fi

if [ -z "$ICE_OUTPUT_SOURCE_PASSWORD" ]; then
  echo "ICE_OUTPUT_SOURCE_PASSWORD is missing"
  exit 1
fi

# Create liq variables file
echo "
radio_id = \"$LIQUIDSOAP_RADIO_ID\"
program_name = \"$LIQUIDSOAP_PROGRAM_NAME\"
ice_output_source_pwd = \"$ICE_OUTPUT_SOURCE_PASSWORD\"
ice_output_port = $ICE_OUTPUT_PORT
ice_output_host = \"$ICE_OUTPUT_HOST\"" > /etc/liquidsoap/icecast_creds.liq

chown liquidsoap:liquidsoap /etc/liquidsoap/icecast_creds.liq

# Start liquidsoap
liquidsoap /etc/liquidsoap/basic.liq
