import { InstanceOptions, IOContext, JanusClient } from '@vtex/api';

import type {
  PromotionDetail,
  PromotionListResponse,
  PromotionSummary,
} from '../typings/promotion';
import type { AppConfigs } from '../helpers/appConfigs';

export class PromotionsClient extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        ...options?.headers,
        'Content-Type': 'application/json',
        'X-Vtex-Use-Https': 'true',
        VtexIdclientAutCookie: ctx.authToken ?? '',
      },
    });
  }

  private buildHeaders(appConfigs?: AppConfigs): Record<string, string> {
    const headers: Record<string, string> = {};

    if (appConfigs?.serviceAppKey && appConfigs?.serviceAppToken) {
      headers['X-VTEX-API-AppKey'] = appConfigs.serviceAppKey;
      headers['X-VTEX-API-AppToken'] = appConfigs.serviceAppToken;
    }

    return headers;
  }

  public async listAll(appConfigs?: AppConfigs): Promise<PromotionSummary[]> {
    const response = await this.http.get<PromotionListResponse>(
      '/api/rnb/pvt/benefits/calculatorconfiguration',
      { headers: this.buildHeaders(appConfigs) },
    );

    return response.items;
  }

  public async getById(
    id: string,
    appConfigs?: AppConfigs,
  ): Promise<PromotionDetail> {
    return this.http.get<PromotionDetail>(
      `/api/rnb/pvt/calculatorconfiguration/${id}`,
      { headers: this.buildHeaders(appConfigs) },
    );
  }
}
