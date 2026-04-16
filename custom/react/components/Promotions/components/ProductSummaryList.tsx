import React, { useCallback } from 'react';
import type { ComponentType, PropsWithChildren } from 'react';

import { ProductSummaryListWithoutQuery } from 'vtex.product-summary';
import { ProductList as ProductListStructuredData } from 'vtex.structured-data';
import { Product } from 'vtex.product-context/react/ProductTypes';
import { usePixel } from 'vtex.pixel-manager';

interface ProductClickParams {
  position: number;
}
export type ActionOnClick = (
  product: Product,
  productClickParams?: ProductClickParams,
) => void;
interface ProductSummaryListProps {
  ProductSummary: ComponentType<{
    product: Product;
    actionOnClick: ActionOnClick;
  }>;
  products: Product[];
  actionOnProductClick?: (product: Product) => void;
}
export const ProductSummaryList = ({
  products,
  ProductSummary,
  children,
  actionOnProductClick,
}: PropsWithChildren<ProductSummaryListProps>) => {
  const { push } = usePixel();
  const productClick = useCallback(
    (product: Product, productClickParams?: ProductClickParams) => {
      actionOnProductClick?.(product);

      const { position } = productClickParams ?? {};

      push({
        event: 'productClick',
        list: 'List of products',
        product,
        position,
      });
    },
    [push, actionOnProductClick],
  );
  return (
    <ProductSummaryListWithoutQuery
      products={products}
      listName={'List of products'}
      ProductSummary={ProductSummary}
      actionOnProductClick={productClick}
      preferredSKU={'FIRST_AVAILABLE'}
    >
      <ProductListStructuredData products={products} />
      {children}
    </ProductSummaryListWithoutQuery>
  );
};
