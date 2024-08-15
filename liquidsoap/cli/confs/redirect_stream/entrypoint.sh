#!/bin/bash

# Liquidsoap entrypoint

# Creds extraction from env
# envs variable list
# INPUT_URL
# OUTPUT_HOST
# OUTPUT_PORT
# OUTPUT_USER
# OUTPUT_PW
# OUTPUT_MOUNT
# OUTPUT_TRANSPORT_PROTO
# OUTPUT_BR
# OUTPUT_SR

# Check if all the required env variables are set
if [ -z "$INPUT_URL" ]; then
  echo "INPUT_URL is missing"
  exit 1
fi

if [ -z "$OUTPUT_HOST" ]; then
  echo "OUTPUT_HOST is missing"
  exit 1
fi

if [ -z "$OUTPUT_PORT" ]; then
  echo "OUTPUT_PORT is missing"
  exit 1
fi

if [ -z "$OUTPUT_USER" ]; then
  echo "OUTPUT_USER is missing"
  exit 1
fi

if [ -z "$OUTPUT_PW" ]; then
  echo "OUTPUT_PW is missing"
  exit 1
fi

if [ -z "$OUTPUT_MOUNT" ]; then
  echo "OUTPUT_MOUNT is missing"
  exit 1
fi

if [ -z "$OUTPUT_TRANSPORT_PROTO" ]; then
  echo "OUTPUT_TRANSPORT_PROTO is missing"
  exit 1
fi

if [ -z "$OUTPUT_BR" ]; then
  echo "OUTPUT_BR is missing"
  exit 1
fi

if [ -z "$OUTPUT_SR" ]; then
  echo "OUTPUT_SR is missing"
  exit 1
fi

# Create liq variables file
echo "
input_url = \"$INPUT_URL\"
output_host = \"$OUTPUT_HOST\"
output_port = $OUTPUT_PORT
output_user = \"$OUTPUT_USER\"
output_pw = \"$OUTPUT_PW\"
output_mount = \"$OUTPUT_MOUNT\"
output_transport_proto = \"$OUTPUT_TRANSPORT_PROTO\"
output_br = $OUTPUT_BR
output_sr = $OUTPUT_SR
" > /etc/liquidsoap/vars.liq

cat /etc/liquidsoap/vars.liq

chown liquidsoap:liquidsoap /etc/liquidsoap/vars.liq

# Start liquidsoap
liquidsoap /etc/liquidsoap/redirect_stream.liq
