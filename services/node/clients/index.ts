import { IOClients } from '@vtex/api';

import { PromotionsClient } from './promotions';

export class Clients extends IOClients {
  public get promotions() {
    return this.getOrSet('promotions', PromotionsClient);
  }
}
