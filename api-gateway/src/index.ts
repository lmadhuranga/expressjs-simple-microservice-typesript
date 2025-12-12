import express, { NextFunction, Request, Response } from 'express';
import { config } from './config';
import { RpcClient } from './clients/rpcClient';
import { requireAuth } from './middleware/auth';
import { authRouter } from './routes/authRoutes';
import { createPingAllHandler, createPingRouter } from './routes/pingRoutes';

async function main() {
  const rpc = new RpcClient();
  await rpc.init();

  const app = express();
  app.use(express.json());

  app.use('/auth', authRouter);
  app.use('/ping', createPingRouter(rpc));
  app.get('/ping-all', requireAuth, createPingAllHandler(rpc));

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    // eslint-disable-next-line no-console
    console.error('Unhandled error', err);
    return res.status(500).json({ message: 'Unexpected error', error: err.message });
  });

  const server = app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`api-gateway running on http://localhost:${config.port}`);
  });

  const shutdown = async () => {
    // eslint-disable-next-line no-console
    console.log('Shutting down api-gateway...');
    await rpc.close().catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error closing RPC client', err);
    });
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start gateway', err);
  process.exit(1);
});
