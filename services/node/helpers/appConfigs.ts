import { getAppConfigs } from '../middlewares/get-app-configs';

export interface AppConfigs {
  serviceAppKey?: string;
  serviceAppToken?: string;
}

/**
 * Obtém as configurações do app (appKey e appToken) de forma segura
 * Retorna undefined se não conseguir obter as configurações
 */
export async function getAppConfigsSafe(
  ctx: Context,
): Promise<AppConfigs | undefined> {
  try {
    const configs = await getAppConfigs(ctx);
    return configs.configs;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      'Could not get app configs, proceeding without appKey/appToken',
    );
    return undefined;
  }
}
