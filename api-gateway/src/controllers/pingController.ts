import { Response } from 'express';
import { SERVICE_QUEUES, ServiceName } from '../config';
import { RpcClient } from '../clients/rpcClient';
import { AuthenticatedRequest } from '../middleware/auth';

export type PingHandler = (req: AuthenticatedRequest, res: Response) => Promise<Response | void>;

function buildPayload(req: AuthenticatedRequest, target: string) {
  const rawMessage = req.query.message;
  const text =
    rawMessage === undefined
      ? `Hello from api-gateway to ${target}`
      : Array.isArray(rawMessage)
        ? rawMessage.join(', ')
        : String(rawMessage);

  return {
    text,
    sentAt: new Date().toISOString(),
    user: req.user?.username ?? 'anonymous',
    target,
  };
}

export function createPingControllers(rpc: RpcClient) {
  const pingService: PingHandler = async (req, res) => {
    const service = req.params.service as ServiceName;
    const queue = SERVICE_QUEUES[service];

    if (!queue) {
      return res.status(404).json({ message: `Unknown service: ${req.params.service}` });
    }

    const payload = buildPayload(req, service);
    const reply = await rpc.send<typeof payload, string>(queue, payload);

    return res.json({ reply });
  };

  const pingAll: PingHandler = async (req, res) => {
    const replies = await Promise.all(
      Object.entries(SERVICE_QUEUES).map(([service, queue]) => {
        const payload = buildPayload(req, service);
        return rpc.send<typeof payload, string>(queue, payload);
      }),
    );

    return res.json({ replies });
  };

  return { pingService, pingAll };
}
