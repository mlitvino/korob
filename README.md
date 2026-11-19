# Korob

A minimalistic mobile expense tracker with a focus on simplicity and ease of use.

## Description

Korob helps you track your expenses effortlessly with a clean, intuitive interface. Built with React Native and Expo, it offers a seamless experience across iOS and Android platforms.

## Running the App

### Local

```bash
cd frontend
yarn install
yarn start          # Start Expo dev server
```

### On a device

```bash
make front          # Expo dev server — scan the QR code with Expo Go (same Wi-Fi)
make tunnel         # Same, but reachable from any network
```

## Server

```bash
make up             # Local stack: http://127.0.0.1:8080/health
make down
```

Pushes to `main` run [cd.yml](.github/workflows/cd.yml): CI checks, then push the image `ghcr.io/mlitvino/korob-proxy:<commit sha>` and deploy
[deploy/compose.yml](deploy/compose.yml) to the VPS (`~/korob`). Roll back on the server with
`TAG=<sha>` in `~/korob/.env` and `docker compose up -d`.

## Roadmap

- [ ] Backend (Golang) with REST API
- [ ] Open Banking API integration for automatic transaction import
- [ ] Multi-account support
- [x] Light/dark theme toggle
- [x] Categories
- [ ] Tags
- [ ] Budget tracking
- [ ] Export reports (PDF/CSV)
- [ ] Cloud sync

## Tech Stack

- **Frontend**: React Native (Expo) with TypeScript — iOS and Android
- **Storage**: SQLite (expo-sqlite + Drizzle ORM) on device
- **Server**: Caddy proxy for the planned backend API at `api.korob.mlitvino.dev`

## License

MIT
