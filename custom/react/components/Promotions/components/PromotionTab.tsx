import React, { ComponentType, PropsWithChildren } from 'react';
import { useQuery } from 'react-apollo';
import type { Product } from 'vtex.product-context/react/ProductTypes';
import { ProductSummaryList } from './ProductSummaryList';
import type { ActionOnClick } from './ProductSummaryList';
import { PromotionTabSkeleton } from './PromotionTabSkeleton';
import { usePromotionFacets } from '../hooks/usePromotionFacets';
import type { ActivePromotion } from '../typings/promotions';
import SEARCH_PRODUCTS from '../../../graphql/queries/searchProducts.gql';
import PRODUCTS_BY_IDENTIFIER from '../../../graphql/queries/productsByIdentifier.gql';

interface Props {
  promotion: ActivePromotion;
  isActive: boolean;
  ProductSummary: ComponentType<{
    product: Product;
    actionOnClick: ActionOnClick;
  }>;
}

function getIdentifierQuery(scope: ActivePromotion['scope']) {
  if (scope.skus.length > 0) {
    return { field: 'sku', values: scope.skus.map(({ id }) => id) };
  }
  if (scope.products.length > 0) {
    return {
      field: 'id',
      values: scope.products.map(({ id }) => id),
    };
  }
  return null;
}

export const PromotionTab = ({
  promotion,
  isActive,
  ProductSummary,
  children,
}: PropsWithChildren<Props>) => {
  const selectedFacets = usePromotionFacets(promotion.scope);
  const identifier = getIdentifierQuery(promotion.scope);
  const useIdentifier = identifier !== null;

  const {
    data: searchData,
    loading: searchLoading,
    error: searchError,
  } = useQuery<{
    productSearch: { products: Product[] };
  }>(SEARCH_PRODUCTS, {
    variables: {
      selectedFacets,
      orderBy: 'OrderByTopSaleDESC',
      hideUnavailableItems: true,
      from: 0,
      to: 29,
    },
    skip: !isActive || useIdentifier || selectedFacets.length === 0,
  });

  const {
    data: identifierData,
    loading: identifierLoading,
    error: identifierError,
  } = useQuery<{
    productsByIdentifier: Product[];
  }>(PRODUCTS_BY_IDENTIFIER, {
    variables: identifier ?? {},
    skip: !isActive || !useIdentifier,
  });

  if (!isActive) return null;

  const loading = useIdentifier ? identifierLoading : searchLoading;
  const error = useIdentifier ? identifierError : searchError;

  const products = Array.from(
    new Map(
      [
        ...(identifierData?.productsByIdentifier ?? []),
        ...(searchData?.productSearch?.products ?? []),
      ].map((p) => [p.productId, p]),
    ).values(),
  );
  if (loading) return <PromotionTabSkeleton />;

  if (error || !products?.length) {
    return (
      <div style={{ textAlign: 'center' }}>
        Nenhum produto encontrado para esta promoção.
      </div>
    );
  }

  return (
    <ProductSummaryList products={products} ProductSummary={ProductSummary}>
      {children}
    </ProductSummaryList>
  );
};
