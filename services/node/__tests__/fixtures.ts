import type {
  PromotionDetail,
  PromotionListResponse,
  PromotionSummary,
} from '../typings/promotion';

export const summaryActive: PromotionSummary = {
  idCalculatorConfiguration: '9921a93e-f03c-44be-a753-de6649d37320',
  name: 'Promoción con cupon',
  beginDate: '2025-05-05T06:00:00Z',
  endDate: '2099-06-20T06:00:00Z',
  isActive: true,
  status: 'active',
  isArchived: false,
};

export const summaryInactiveFlag: PromotionSummary = {
  idCalculatorConfiguration: 'aaa-inactive-flag',
  name: 'Inativa por flag',
  beginDate: '2025-01-01T00:00:00Z',
  endDate: '2099-12-31T00:00:00Z',
  isActive: false,
  status: 'active',
  isArchived: false,
};

export const summaryArchived: PromotionSummary = {
  idCalculatorConfiguration: 'bbb-archived',
  name: 'Arquivada',
  beginDate: '2025-01-01T00:00:00Z',
  endDate: '2099-12-31T00:00:00Z',
  isActive: true,
  status: 'active',
  isArchived: true,
};

export const summaryExpired: PromotionSummary = {
  idCalculatorConfiguration: 'ccc-expired',
  name: 'Expirada',
  beginDate: '2020-01-01T00:00:00Z',
  endDate: '2020-12-31T00:00:00Z',
  isActive: true,
  status: 'active',
  isArchived: false,
};

export const summaryFuture: PromotionSummary = {
  idCalculatorConfiguration: 'ddd-future',
  name: 'Futura',
  beginDate: '2099-01-01T00:00:00Z',
  endDate: '2099-12-31T00:00:00Z',
  isActive: true,
  status: 'active',
  isArchived: false,
};

export const summaryNoEndDate: PromotionSummary = {
  idCalculatorConfiguration: 'eee-no-end',
  name: 'Sem data de fim',
  beginDate: '2024-01-01T00:00:00Z',
  isActive: true,
  status: 'active',
  isArchived: false,
};

export const summaryInactiveStatus: PromotionSummary = {
  idCalculatorConfiguration: 'fff-inactive-status',
  name: 'Status inativo',
  beginDate: '2025-01-01T00:00:00Z',
  endDate: '2099-12-31T00:00:00Z',
  isActive: true,
  status: 'inactive',
  isArchived: false,
};

export const promotionDetail: PromotionDetail = {
  idCalculatorConfiguration: '094e0db6-0c4b-48a3-9db6-681963dd1543',
  name: '240525 CUPÓN BEAUTY FEST COSMÉTICOS 25%',
  beginDateUtc: '2025-05-24T06:00:00Z',
  endDateUtc: '2025-05-26T06:00:00Z',
  paymentsMethods: [{ id: '207', name: 'Pago en cuotas BAC (207)' }],
  collections: [
    { id: '22576', name: '240525 CR BEAUTY FEST COSMÉTICOS BAC (22576)' },
  ],
  brands: [],
  products: [],
  skus: [],
  categories: [],
};

export const promotionDetailNoEnd: PromotionDetail = {
  idCalculatorConfiguration: 'eee-no-end',
  name: 'Sem data de fim',
  beginDateUtc: '2024-01-01T00:00:00Z',
  paymentsMethods: [],
  collections: [],
  brands: [{ id: '9280', name: 'Brand' }],
  products: [],
  skus: [],
  categories: [],
};

export const listResponse: PromotionListResponse = {
  items: [
    summaryActive,
    summaryInactiveFlag,
    summaryArchived,
    summaryExpired,
    summaryFuture,
    summaryNoEndDate,
    summaryInactiveStatus,
  ],
  limitConfiguration: { activesCount: 77, limit: 150 },
};
