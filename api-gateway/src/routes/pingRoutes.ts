import { Response, Router } from 'express';
import { RpcClient } from '../clients/rpcClient';
import { requireAuth } from '../middleware/auth';
import { createPingControllers, PingHandler } from '../controllers/pingController';

function withErrorHandling(handler: PingHandler) {
  return async (req: any, res: Response) => {
    try {
      await handler(req, res);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      return res.status(500).json({ message: 'RPC error', error: message });
    }
  };
}

export function createPingRouter(rpc: RpcClient): Router {
  const router = Router();
  const { pingAll, pingService } = createPingControllers(rpc);
  const pingAllWithErrors = withErrorHandling(pingAll);
  const pingServiceWithErrors = withErrorHandling(pingService);

  router.get('/all', requireAuth, pingAllWithErrors);
  router.get('/:service', requireAuth, pingServiceWithErrors);

  return router;
}

export function createPingAllHandler(rpc: RpcClient) {
  const { pingAll } = createPingControllers(rpc);
  return withErrorHandling(pingAll);
}
