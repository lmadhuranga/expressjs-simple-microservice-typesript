# Simple Nest Microserver (Express rewrite)

This workspace now uses lightweight Express services with RabbitMQ RPC instead of the original Nest scaffold.

## Project structure
- `api-gateway/` — Express gateway with JWT auth, RPC client, and ping routes.
  - `src/config.ts` — shared config (ports/secrets/queues).
  - `src/clients/rpcClient.ts` — RabbitMQ RPC client.
  - `src/middleware/auth.ts` — JWT middleware.
  - `src/controllers/` — request handlers (auth, ping).
  - `src/routes/` — route definitions.
  - `src/index.ts` — app bootstrap and wiring.
- `service1/` — worker listening on `service1_queue`.
- `service2/` — worker listening on `service2_queue`.

## Prerequisites
- Node 18+ (or compatible)
- RabbitMQ running and reachable (default `amqp://localhost:5672`)

## Install dependencies
```bash
npm install --prefix api-gateway
npm install --prefix service1
npm install --prefix service2
```

## Environment
Optional overrides:
- `PORT` (gateway, default `3000`)
- `JWT_SECRET` (gateway)
- `RABBITMQ_URL` (all services, default `amqp://localhost:5672`)
- `RPC_TIMEOUT_MS` (gateway RPC timeout)

## Run in dev mode
Use separate terminals:
```bash
npm run dev --prefix api-gateway
npm run dev --prefix service1
npm run dev --prefix service2
```

## Build for production
```bash
npm run build --prefix api-gateway
npm run build --prefix service1
npm run build --prefix service2
```

## Basic usage
1) Get a token:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo"}'
```
2) Call a service:
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3000/ping/service1?message=hi"
```
3) Ping all services:
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/ping-all
```
