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

## Roadmap

- [ ] Backend (Golang) with REST API
- [ ] Open Banking API integration for automatic transaction import
- [ ] Multi-account support
- [ ] Light/dark theme toggle
- [ ] Categories and tags
- [ ] Budget tracking
- [ ] Export reports (PDF/CSV)
- [ ] Cloud sync

## Tech Stack

- **Frontend**: React Native (Expo) with TypeScript — iOS and Android
- **Storage**: SQLite (expo-sqlite + Drizzle ORM) on device
- **Nginx**: TLS reverse proxy for the planned backend API

## License

MIT
