import {
  ClientsConfig,
  LRUCache,
  RecorderState,
  Service,
  ServiceContext,
  method,
} from '@vtex/api';

import { Clients } from './clients';
import { getActivePromotions } from './middlewares/getActivePromotions';

const TIMEOUT_MS = 3000;

const memoryCache = new LRUCache<string, never>({ max: 5000 });

metrics.trackCache('status', memoryCache);

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    status: {
      memoryCache,
    },
  },
};

declare global {
  type Context = ServiceContext<Clients, State>;

  interface State extends RecorderState {
    code: number;
  }
}

export default new Service({
  clients,
  routes: {
    promotions: method({
      GET: [getActivePromotions],
    }),
  },
});
