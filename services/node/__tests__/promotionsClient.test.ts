import { PromotionsClient } from '../clients/promotions';
import { listResponse, promotionDetail, summaryActive } from './fixtures';

const makeClient = () => {
  const ctx = { account: 'test', authToken: 'token' } as any;
  const client = new PromotionsClient(ctx);
  return client;
};

describe('PromotionsClient', () => {
  describe('listAll', () => {
    it('retorna o array items da resposta da API', async () => {
      const client = makeClient();
      (client as any).http.get.mockResolvedValueOnce(listResponse);

      const result = await client.listAll();

      expect(result).toEqual(listResponse.items);
    });

    it('chama o endpoint correto', async () => {
      const client = makeClient();
      (client as any).http.get.mockResolvedValueOnce(listResponse);

      await client.listAll();

      expect((client as any).http.get).toHaveBeenCalledWith(
        '/api/rnb/pvt/benefits/calculatorconfiguration',
        expect.any(Object),
      );
    });

    it('inclui appKey e appToken nos headers quando fornecidos', async () => {
      const client = makeClient();
      (client as any).http.get.mockResolvedValueOnce(listResponse);

      await client.listAll({
        serviceAppKey: 'key123',
        serviceAppToken: 'token123',
      });

      expect((client as any).http.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            'X-VTEX-API-AppKey': 'key123',
            'X-VTEX-API-AppToken': 'token123',
          },
        }),
      );
    });

    it('não inclui headers de auth quando appConfigs não fornecido', async () => {
      const client = makeClient();
      (client as any).http.get.mockResolvedValueOnce(listResponse);

      await client.listAll();

      expect((client as any).http.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ headers: {} }),
      );
    });

    it('retorna array vazio quando items está vazio', async () => {
      const client = makeClient();
      (client as any).http.get.mockResolvedValueOnce({
        items: [],
        limitConfiguration: { activesCount: 0, limit: 150 },
      });

      const result = await client.listAll();

      expect(result).toEqual([]);
    });

    it('propaga erro quando a requisição falha', async () => {
      const client = makeClient();
      (client as any).http.get.mockRejectedValueOnce(
        new Error('Network error'),
      );

      await expect(client.listAll()).rejects.toThrow('Network error');
    });
  });

  describe('getById', () => {
    it('retorna o primeiro elemento do array retornado pela API', async () => {
      const client = makeClient();
      (client as any).http.get.mockResolvedValueOnce([promotionDetail]);

      const result = await client.getById(
        '094e0db6-0c4b-48a3-9db6-681963dd1543',
      );

      expect(result).toEqual(promotionDetail);
    });

    it('chama o endpoint correto com o id fornecido', async () => {
      const client = makeClient();
      const id = '094e0db6-0c4b-48a3-9db6-681963dd1543';
      (client as any).http.get.mockResolvedValueOnce([promotionDetail]);

      await client.getById(id);

      expect((client as any).http.get).toHaveBeenCalledWith(
        `/api/rnb/pvt/calculatorconfiguration/${id}`,
        expect.any(Object),
      );
    });

    it('inclui appKey e appToken nos headers quando fornecidos', async () => {
      const client = makeClient();
      (client as any).http.get.mockResolvedValueOnce([promotionDetail]);

      await client.getById(summaryActive.idCalculatorConfiguration, {
        serviceAppKey: 'key123',
        serviceAppToken: 'token123',
      });

      expect((client as any).http.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            'X-VTEX-API-AppKey': 'key123',
            'X-VTEX-API-AppToken': 'token123',
          },
        }),
      );
    });

    it('propaga erro quando a requisição falha', async () => {
      const client = makeClient();
      (client as any).http.get.mockRejectedValueOnce(new Error('Not found'));

      await expect(client.getById('invalid-id')).rejects.toThrow('Not found');
    });
  });
});
