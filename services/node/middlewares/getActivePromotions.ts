import type {
  ActivePromotion,
  PromotionDetail,
  PromotionSummary,
} from '../typings/promotion';
import { getAppConfigsSafe } from '../helpers/appConfigs';

const CONCURRENCY_LIMIT = 5;

async function inBatches<T, R>(
  items: T[],
  batchSize: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const settled = await Promise.allSettled(batch.map(fn));

    settled.forEach((result) => {
      if (result.status === 'fulfilled') results.push(result.value);
    });
  }

  return results;
}

function isActive(promo: PromotionSummary): boolean {
  if (!promo.isActive || promo.isArchived || promo.status !== 'active') {
    return false;
  }

  const now = new Date();
  const begin = new Date(promo.beginDate);

  if (begin > now) return false;

  if (promo.endDate) {
    return new Date(promo.endDate) >= now;
  }

  return true;
}

function mapToResponse(detail: PromotionDetail): ActivePromotion {
  const collections = new Set([
    ...(detail.collections ?? []),
    ...(detail.collections1BuyTogether ?? []),
    ...(detail.collections2BuyTogether ?? []),
  ]);
  const skus = new Set([
    ...detail.skus,
    ...(detail.listSku1BuyTogether ?? []),
    ...(detail.listSku2BuyTogether ?? []),
  ]);
  return {
    id: detail.idCalculatorConfiguration,
    name: detail.name,
    startDate: detail.beginDateUtc,
    endDate: detail.endDateUtc ?? '',
    paymentMethods: detail.paymentsMethods ?? [],
    scope: {
      collections: [...collections],
      brands: detail.brands ?? [],
      products: detail.products ?? [],
      skus: [...skus],
      categories: detail.categories ?? [],
    },
  };
}

export async function getActivePromotions(
  ctx: Context,
  next: () => Promise<void>,
) {
  const {
    clients: { promotions },
    vtex: { logger },
  } = ctx;

  try {
    const appConfigs = await getAppConfigsSafe(ctx);
    const all = await promotions.listAll(appConfigs);
    const active = all.filter(isActive);

    const details = await inBatches(active, CONCURRENCY_LIMIT, (promo) =>
      promotions.getById(promo.idCalculatorConfiguration, appConfigs),
    );

    ctx.status = 200;
    ctx.body = details.map(mapToResponse);
  } catch (err) {
    logger.error({ message: 'getActivePromotions failed', error: err });
    ctx.status = 500;
    ctx.body = { error: 'Failed to fetch active promotions' };
  }

  await next();
}
