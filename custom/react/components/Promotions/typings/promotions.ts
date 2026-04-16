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

export interface SelectedFacet {
  key: string;
  value: string;
}
