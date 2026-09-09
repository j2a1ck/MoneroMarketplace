# MoneroMarket

A NestJS-based peer-to-peer marketplace backend with anonymous-style trading flows, Monero-based payment handling, and real-time chat between buyers and sellers.

This project is designed for a marketplace where users can list products, negotiate order status, make payments in XMR, and communicate securely through a WebSocket chat system.

## Overview

This application provides the backend for a privacy-oriented marketplace experience. It includes:

- User registration and authentication
- Product listing and search
- Buyer/seller order lifecycle
- Monero wallet RPC integration for crypto settlement
- WebSocket-based messaging between participants
- PostgreSQL persistence via TypeORM
- Health monitoring and request throttling

## Core Features

- Secure sign-up and sign-in flow with JWT authentication
- Product creation, search, comments, and listing retrieval
- Buyer purchase request and seller order acceptance flow
- Escrow-style payment flow tied to Monero subaddresses
- Payment status checks and wallet payout configuration
- Real-time chat rooms for conversations attached to orders or product negotiations
- Structured logging and rate limiting
- Dockerized local development setup

## Tech Stack

- Node.js + TypeScript
- NestJS
- PostgreSQL + TypeORM
- JWT authentication
- Socket.IO / WebSockets
- Monero wallet RPC via monero-ts
- Docker + Docker Compose
- Jest for testing

## Prerequisites

Before running the project, make sure you have:

- Node.js 20+
- pnpm
- PostgreSQL running locally or via Docker
- A Monero wallet RPC node / wallet accessible by the backend
- A `.env` file configured for the app


## Installation

```bash
pnpm install
```

## Running the Application

### Development

```bash
pnpm run start:dev
```

### Production build

```bash
pnpm run build
pnpm run start:prod
```

### Docker Compose

```bash
docker compose up --build
```

This starts the NestJS backend and a PostgreSQL instance.

## Database Setup

The project uses TypeORM with PostgreSQL. Database settings are loaded from environment variables and configured in `src/app.module.ts`.

If you are using Docker, the compose file creates a PostgreSQL container automatically.

## Monero Payment Setup

The payment service connects to a Monero wallet RPC and creates or reuses subaddresses for orders. This is designed for escrow-style payment flows and wallet-based settlement.

Important:

- Use a dedicated wallet or isolated environment for testing.
- Ensure the RPC endpoint is reachable and credentials are correct.
- Treat stored wallet credentials as sensitive.

## Testing

```bash
pnpm run test
pnpm run test:e2e
pnpm run test:cov
```

## Health Check

The application includes a health module for service monitoring.

```bash
curl http://localhost:3000/health
```

## Security and Risk Notes

This project is intended for educational and experimental use. Because it includes payment logic, crypto wallet integration, and anonymous marketplace patterns, use it only in trusted environments and with proper compliance review.

Recommended precautions:

- Keep secrets in environment variables
- Restrict RPC access to localhost or trusted networks
- Validate permissions on all order actions
- Run with HTTPS in production
- Review the code carefully before using with real funds

## License

This project is currently unlicensed unless you explicitly add a license file and update the package metadata.

## Contributing

Pull requests and improvements are welcome. If you plan to use this project as a production service, review all security and compliance implications before deployment.
