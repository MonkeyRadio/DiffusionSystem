# MonkeyRadio - Diffusion System

## Set environment variables

Take a look at .env.example

## Run docker compose services

- Diffusion nest api
- Icecast server
- nginx proxy compression

```bash
docker compose up -d
```

## Create a radio diffusion

Use liquidsoap-service.sh script to spawn a radio diffusion process

```bash
./liquidsoap-service.sh start <radioId> <icecast_host> <icecast_port> <icecast_password> <monkeyradio_login_api_url> <shared_volume_path>
./liquidsoap-service.sh start 66033ed8a012843dc7a92949 icecast 8000 sourcepw https://api.preprod.monkeyradio.fr/v4/auth/login shared
```
