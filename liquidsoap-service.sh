#!/bin/bash

# This script simplify the liquidsoap docker instance maniuplation

# Commands :
# - start : Start the liquidsoap docker instance
#  - Usage : ./liquidsoap-service.sh start <radio_id> <program_name> <ice_output_host> <ice_output_port> <ice_output_source_pwd> <LIQUIDSOAP_API_LOGIN_URL> <shared_volume_path> <harbor_stream_port>
# - stop : Stop the liquidsoap docker instance
#  - Usage : ./liquidsoap-service.sh stop <radio_id>
# - restart : Restart the liquidsoap docker instance
#  - Usage : ./liquidsoap-service.sh restart <radio_id>

function build {
  docker build -t liquidsoap-custom-image:latest liquidsoap -f liquidsoap/Dockerfile
}

function usage {
  echo "Commands :"
  echo " - start : Start the liquidsoap docker instance"
  echo "  - Usage : ./liquidsoap-service.sh start <radio_id> <program_name> <ice_output_host> <ice_output_port> <ice_output_source_pwd> <LIQUIDSOAP_API_LOGIN_URL> <shared_volume_path> <harbor_stream_port>"
  echo " - stop : Stop the liquidsoap docker instance"
  echo "  - Usage : ./liquidsoap-service.sh stop <radio_id> <program_name>"
  echo " - restart : Restart the liquidsoap docker instance"
  echo "  - Usage : ./liquidsoap-service.sh restart <radio_id> <program_name>"
}

# Check if the command is set
if [ -z "$1" ]; then
  echo "Command is missing"
  usage
  exit 1
fi

# Check if the radio_id is set
if [ -z "$2" ]; then
  echo "Radio ID is missing"
  exit 1
fi

# Check if the program_name is set
if [ -z "$3" ]; then
  echo "Program name is missing"
  exit 1
fi

# Start command
if [ "$1" = "start" ]; then
  # Check if the program_name is set
  if [ -z "$3" ]; then
    echo "Program Name is missing"
    exit 1
  fi

  # Check if the ice_output_host is set
  if [ -z "$4" ]; then
    echo "ICE Output Host is missing"
    exit 1
  fi

  # Check if the ice_output_port is set
  if [ -z "$5" ]; then
    echo "ICE Output Port is missing"
    exit 1
  fi

  # Check if the ice_output_source_pwd is set
  if [ -z "$6" ]; then
    echo "ICE Output Source Password is missing"
    exit 1
  fi

  # Check if the LIQUIDSOAP_API_LOGIN_URL is set
  if [ -z "$7" ]; then
    echo "LIQUIDSOAP API Login URL is missing"
    exit 1
  fi

  # Check if the shared_volume_path is set
  if [ -z "$8" ]; then
    echo "Shared Volume Path is missing"
    exit 1
  fi

  if [ -z "$9" ]; then
    echo "Harbor Stream Port is missing"
    exit 1
  fi

  # Start the liquidsoap docker instance
  build
  docker run -d --restart always --network monkeyradio_diffusion_network --name liquidsoap-$2-$3 -p $9:8080 -v $8:/shared -v ./liquidsoap/persist_output:/persist_output -e LIQUIDSOAP_RADIO_ID=$2 -e LIQUIDSOAP_PROGRAM_NAME=$3 -e LIQUIDSOAP_API_LOGIN_URL=$7 -e ICE_OUTPUT_HOST=$4 -e ICE_OUTPUT_PORT=$5 -e ICE_OUTPUT_SOURCE_PASSWORD=$6 liquidsoap-custom-image:latest
fi

# Stop command
if [ "$1" = "stop" ]; then
  # Stop the liquidsoap docker instance
  docker stop liquidsoap-$2-$3
  docker rm liquidsoap-$2-$3
fi

# Restart command
if [ "$1" = "restart" ]; then
  # Restart the liquidsoap docker instance
  docker restart liquidsoap-$2-$3
fi

if [ "$1" = "help" ]; then
  usage
fi

exit 0