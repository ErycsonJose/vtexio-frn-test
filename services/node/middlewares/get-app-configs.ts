interface Configs {
  serviceAppKey: string;
  serviceAppToken: string;
}

interface GetAppConfigsResponse {
  configs: Configs;
  headers: Record<string, string>;
}

export async function getAppConfigs(
  ctx: Context,
): Promise<GetAppConfigsResponse> {
  try {
    const { apps } = ctx.clients;
    const app = process.env.VTEX_APP_ID ?? '';
    const configs: Configs = await apps.getAppSettings(app);
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-VTEX-Use-Https': 'true',
      'X-VTEX-API-AppKey': configs?.serviceAppKey,
      'X-VTEX-API-AppToken': configs?.serviceAppToken,
    };

    return { configs, headers };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching app configs:', error);
    throw new Error('Error fetching app configs');
  }
}
