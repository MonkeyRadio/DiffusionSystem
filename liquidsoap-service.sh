#!/bin/bash

# This script simplify the liquidsoap docker instance maniuplation

# Commands :
# - start : Start the liquidsoap docker instance
#  - Usage : ./liquidsoap-service.sh start <radio_id> <program_name> <ice_output_host> <ice_output_port> <ice_output_source_pwd> <MONKEYRADIO_API_URL> <shared_volume_path> <root_domain_name>
# - stop : Stop the liquidsoap docker instance
#  - Usage : ./liquidsoap-service.sh stop <radio_id>
# - restart : Restart the liquidsoap docker instance
#  - Usage : ./liquidsoap-service.sh restart <radio_id>

function build {
  docker build -t liquidsoap-custom-image:latest liquidsoap -f liquidsoap/Dockerfile
}

function generate_cert {
  CRT_LENGTH=2048
  CRT_VALIDITY=36500
  RADID=$1
  PRGNAME=$2
  DOMAIN=$3
  SSLSUBJECT="/C=FR/ST=IDF/L=Paris/O=MonkeyRadio/OU=IT/CN=*.$DOMAIN"
  mkdir -p ./shared/certs/$DOMAIN
  echo "Generating root certificate for $DOMAIN"
  openssl genrsa -out ./shared/certs/$DOMAIN/ca_key.pem $CRT_LENGTH
  openssl req -x509 -new -nodes -key ./shared/certs/$DOMAIN/ca_key.pem -sha256 -days $CRT_VALIDITY -out ./shared/certs/$DOMAIN/ca.crt -subj '/CN=MonkeyRadio Root CA/C=AT/ST=Paris/L=Paris/O=MonkeyRadio'
  echo "Generating certificate for *.$DOMAIN"
  openssl genrsa -out ./shared/certs/$DOMAIN/cert_key.pem $CRT_LENGTH
  openssl req -new -key ./shared/certs/$DOMAIN/cert_key.pem -out ./shared/certs/$DOMAIN/cert.csr -subj "$SSLSUBJECT"
  echo "authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = *.$DOMAIN" > ./shared/certs/$DOMAIN/cert.ext
  openssl x509 -req -in ./shared/certs/$DOMAIN/cert.csr -out ./shared/certs/$DOMAIN/cert.pem -CA ./shared/certs/$DOMAIN/ca.crt -CAkey ./shared/certs/$DOMAIN/ca_key.pem -days $CRT_VALIDITY -extfile ./shared/certs/$DOMAIN/cert.ext
  chmod 755 ./shared/certs/$DOMAIN/*
}

function usage {
  echo "Commands :"
  echo " - start : Start the liquidsoap docker instance"
  echo "  - Usage : ./liquidsoap-service.sh start <radio_id> <program_name> <ice_output_host> <ice_output_port> <ice_output_source_pwd> <MONKEYRADIO_API_URL> <shared_volume_path> <root_domain_name>"
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

  # Check if the MONKEYRADIO_API_URL is set
  if [ -z "$7" ]; then
    echo "LIQUIDSOAP API Login URL is missing"
    exit 1
  fi

  # Check if the shared_volume_path is set
  if [ -z "$8" ]; then
    echo "Shared Volume Path is missing"
    exit 1
  fi

  # Check if the domain root name is set
  if [ -z "$9" ]; then
    echo "Root domain name is missing"
    exit 1
  fi

  # Start the liquidsoap docker instance
  generate_cert $2 $3 $9
  build
  docker run -d \
    --restart always \
    --network monkeyradio_diffusion_network \
    --name liquidsoap-$2-$3 \
    --label "traefik.enable=true" \
    --label "traefik.tcp.routers.liquidsoap-$2-$3.rule=HostSNI(\`liquidsoap-$2-$3.$9\`)" \
    --label "traefik.tcp.routers.liquidsoap-$2-$3.tls=true" \
    --label "traefik.tcp.routers.liquidsoap-$2-$3.entrypoints=websecure" \
    --label "traefik.tcp.services.liquidsoap-$2-$3.loadbalancer.server.port=8080" \
    --label "traefik.tcp.routers.liquidsoap-$2-$3.tls.passthrough=true" \
    --label "traefik.http.routers.liquidsoap-$2-$3.rule=Path(\`/v1/ca/liquidsoap-$2-$3/ca.crt\`)" \
    --label "traefik.http.services.liquidsoap-$2-$3.loadbalancer.server.port=8081" \
    --label "traefik.http.middlewares.lq-$2-$3-stripprefix.stripprefix.prefixes=/v1/ca/liquidsoap-$2-$3/" \
    --label "traefik.http.routers.liquidsoap-$2-$3.middlewares=lq-$2-$3-stripprefix" \
    -v $8:/shared -v ./liquidsoap/persist_output:/persist_output \
    -e LIQUIDSOAP_RADIO_ID=$2 -e LIQUIDSOAP_PROGRAM_NAME=$3 -e MONKEYRADIO_API_URL=$7 -e ICE_OUTPUT_HOST=$4 -e ICE_OUTPUT_PORT=$5 -e ICE_OUTPUT_SOURCE_PASSWORD=$6 -e DOMAIN=$9 \
    liquidsoap-custom-image:latest
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