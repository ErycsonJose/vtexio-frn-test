export interface PromotionSummary {
  idCalculatorConfiguration: string;
  name: string;
  beginDate: string;
  endDate?: string;
  isActive: boolean;
  status: string;
  isArchived: boolean;
}

export interface PromotionListResponse {
  items: PromotionSummary[];
  limitConfiguration: {
    activesCount: number;
    limit: number;
  };
}

export interface PromotionDetail {
  idCalculatorConfiguration: string;
  name: string;
  beginDateUtc: string;
  endDateUtc?: string;
  paymentsMethods: Array<{ id: string; name: string }>;
  collections: Array<{ id: string; name: string }>;
  brands: Array<{ id: string; name: string }>;
  products: Array<{ id: string; name: string }>;
  skus: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
}

export interface ActivePromotion {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  paymentMethods: Array<{ id: string; name: string }>;
  scope: {
    collections: Array<{ id: string; name: string }>;
    brands: Array<{ id: string; name: string }>;
    products: Array<{ id: string; name: string }>;
    skus: Array<{ id: string; name: string }>;
    categories: Array<{ id: string; name: string }>;
  };
}
