import { getActivePromotions } from '../middlewares/getActivePromotions';
import {
  listResponse,
  promotionDetail,
  promotionDetailNoEnd,
  summaryActive,
  summaryNoEndDate,
} from './fixtures';

jest.mock('../helpers/appConfigs', () => ({
  getAppConfigsSafe: jest.fn().mockResolvedValue(undefined),
}));

const makeCtx = () => {
  const ctx: any = {
    clients: {
      promotions: {
        listAll: jest.fn(),
        getById: jest.fn(),
      },
    },
    vtex: {
      logger: { error: jest.fn() },
    },
    status: 0,
    body: null,
  };

  return ctx;
};

const next = jest.fn().mockResolvedValue(undefined);

beforeEach(() => jest.clearAllMocks());

describe('getActivePromotions middleware', () => {
  describe('filtro isActive', () => {
    it('chama getById apenas para promoções ativas, não arquivadas, com status active e dentro do período', async () => {
      const ctx = makeCtx();
      ctx.clients.promotions.listAll.mockResolvedValue(listResponse.items);
      ctx.clients.promotions.getById
        .mockResolvedValueOnce(promotionDetail)
        .mockResolvedValueOnce(promotionDetailNoEnd);

      await getActivePromotions(ctx, next);

      expect(ctx.clients.promotions.getById).toHaveBeenCalledTimes(2);
      expect(ctx.clients.promotions.getById).toHaveBeenCalledWith(
        summaryActive.idCalculatorConfiguration,
        undefined,
      );
      expect(ctx.clients.promotions.getById).toHaveBeenCalledWith(
        summaryNoEndDate.idCalculatorConfiguration,
        undefined,
      );
    });

    it('exclui promoção com isActive=false', async () => {
      const ctx = makeCtx();
      ctx.clients.promotions.listAll.mockResolvedValue(listResponse.items);
      ctx.clients.promotions.getById.mockResolvedValue(promotionDetail);

      await getActivePromotions(ctx, next);

      const calledIds = ctx.clients.promotions.getById.mock.calls.map(
        (c: any[]) => c[0],
      );

      expect(calledIds).not.toContain('aaa-inactive-flag');
    });

    it('exclui promoção arquivada', async () => {
      const ctx = makeCtx();
      ctx.clients.promotions.listAll.mockResolvedValue(listResponse.items);
      ctx.clients.promotions.getById.mockResolvedValue(promotionDetail);

      await getActivePromotions(ctx, next);

      const calledIds = ctx.clients.promotions.getById.mock.calls.map(
        (c: any[]) => c[0],
      );

      expect(calledIds).not.toContain('bbb-archived');
    });

    it('exclui promoção expirada', async () => {
      const ctx = makeCtx();
      ctx.clients.promotions.listAll.mockResolvedValue(listResponse.items);
      ctx.clients.promotions.getById.mockResolvedValue(promotionDetail);

      await getActivePromotions(ctx, next);

      const calledIds = ctx.clients.promotions.getById.mock.calls.map(
        (c: any[]) => c[0],
      );

      expect(calledIds).not.toContain('ccc-expired');
    });

    it('exclui promoção com beginDate no futuro', async () => {
      const ctx = makeCtx();
      ctx.clients.promotions.listAll.mockResolvedValue(listResponse.items);
      ctx.clients.promotions.getById.mockResolvedValue(promotionDetail);

      await getActivePromotions(ctx, next);

      const calledIds = ctx.clients.promotions.getById.mock.calls.map(
        (c: any[]) => c[0],
      );

      expect(calledIds).not.toContain('ddd-future');
    });

    it('exclui promoção com status !== active', async () => {
      const ctx = makeCtx();
      ctx.clients.promotions.listAll.mockResolvedValue(listResponse.items);
      ctx.clients.promotions.getById.mockResolvedValue(promotionDetail);

      await getActivePromotions(ctx, next);

      const calledIds = ctx.clients.promotions.getById.mock.calls.map(
        (c: any[]) => c[0],
      );

      expect(calledIds).not.toContain('fff-inactive-status');
    });

    it('inclui promoção sem endDate (sem data de expiração)', async () => {
      const ctx = makeCtx();
      ctx.clients.promotions.listAll.mockResolvedValue([summaryNoEndDate]);
      ctx.clients.promotions.getById.mockResolvedValue(promotionDetailNoEnd);

      await getActivePromotions(ctx, next);

      expect(ctx.clients.promotions.getById).toHaveBeenCalledWith(
        summaryNoEndDate.idCalculatorConfiguration,
        undefined,
      );
    });
  });

  describe('mapeamento mapToResponse', () => {
    it('mapeia corretamente os campos do PromotionDetail para ActivePromotion', async () => {
      const ctx = makeCtx();
      ctx.clients.promotions.listAll.mockResolvedValue([summaryActive]);
      ctx.clients.promotions.getById.mockResolvedValue(promotionDetail);

      await getActivePromotions(ctx, next);

      expect(ctx.body).toEqual([
        {
          id: promotionDetail.idCalculatorConfiguration,
          name: promotionDetail.name,
          startDate: promotionDetail.beginDateUtc,
          endDate: promotionDetail.endDateUtc,
          paymentMethods: promotionDetail.paymentsMethods,
          scope: {
            collections: promotionDetail.collections,
            brands: promotionDetail.brands,
            products: promotionDetail.products,
            skus: promotionDetail.skus,
            categories: promotionDetail.categories,
          },
        },
      ]);
    });

    it('usa string vazia para endDate quando endDateUtc ausente', async () => {
      const ctx = makeCtx();
      ctx.clients.promotions.listAll.mockResolvedValue([summaryNoEndDate]);
      ctx.clients.promotions.getById.mockResolvedValue(promotionDetailNoEnd);

      await getActivePromotions(ctx, next);

      expect(ctx.body[0].endDate).toBe('');
    });

    it('usa arrays vazios para campos de scope ausentes', async () => {
      const ctx = makeCtx();
      const detailSemScope = {
        ...promotionDetail,
        collections: undefined,
        brands: undefined,
      };
      ctx.clients.promotions.listAll.mockResolvedValue([summaryActive]);
      ctx.clients.promotions.getById.mockResolvedValue(detailSemScope);

      await getActivePromotions(ctx, next);

      expect(ctx.body[0].scope.collections).toEqual([]);
      expect(ctx.body[0].scope.brands).toEqual([]);
    });
  });

  describe('resposta HTTP', () => {
    it('retorna status 200 com array de promoções ativas', async () => {
      const ctx = makeCtx();
      ctx.clients.promotions.listAll.mockResolvedValue([summaryActive]);
      ctx.clients.promotions.getById.mockResolvedValue(promotionDetail);

      await getActivePromotions(ctx, next);

      expect(ctx.status).toBe(200);
      expect(Array.isArray(ctx.body)).toBe(true);
    });

    it('retorna array vazio quando nenhuma promoção passa no filtro', async () => {
      const ctx = makeCtx();
      ctx.clients.promotions.listAll.mockResolvedValue([]);

      await getActivePromotions(ctx, next);

      expect(ctx.status).toBe(200);
      expect(ctx.body).toEqual([]);
    });

    it('chama next() ao final', async () => {
      const ctx = makeCtx();
      ctx.clients.promotions.listAll.mockResolvedValue([]);

      await getActivePromotions(ctx, next);

      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe('tratamento de erros', () => {
    it('retorna status 500 quando listAll lança erro', async () => {
      const ctx = makeCtx();
      ctx.clients.promotions.listAll.mockRejectedValue(new Error('API down'));

      await getActivePromotions(ctx, next);

      expect(ctx.status).toBe(500);
      expect(ctx.body).toEqual({ error: 'Failed to fetch active promotions' });
    });

    it('loga o erro quando listAll falha', async () => {
      const ctx = makeCtx();
      const err = new Error('API down');
      ctx.clients.promotions.listAll.mockRejectedValue(err);

      await getActivePromotions(ctx, next);

      expect(ctx.vtex.logger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'getActivePromotions failed',
          error: err,
        }),
      );
    });

    it('ignora promoções individuais cujo getById falha e continua com as demais', async () => {
      const ctx = makeCtx();
      const summaryB = {
        ...summaryActive,
        idCalculatorConfiguration: 'id-b',
        name: 'Promo B',
      };
      ctx.clients.promotions.listAll.mockResolvedValue([
        summaryActive,
        summaryB,
      ]);
      ctx.clients.promotions.getById
        .mockRejectedValueOnce(new Error('Not found'))
        .mockResolvedValueOnce(promotionDetail);

      await getActivePromotions(ctx, next);

      expect(ctx.status).toBe(200);
      expect(ctx.body).toHaveLength(1);
      expect(ctx.body[0].id).toBe(promotionDetail.idCalculatorConfiguration);
    });

    it('chama next() mesmo quando ocorre erro', async () => {
      const ctx = makeCtx();
      ctx.clients.promotions.listAll.mockRejectedValue(new Error('fail'));

      await getActivePromotions(ctx, next);

      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
