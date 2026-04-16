import React from 'react';
import type { ComponentType, PropsWithChildren } from 'react';
import type { Product } from 'vtex.product-context/react/ProductTypes';
import { PromotionTabList } from './components/PromotionTabList';
import { PromotionsSkeleton } from './components/PromotionsSkeleton';
import { usePromotions } from './hooks/usePromotions';
import type { ActionOnClick } from './components/ProductSummaryList';

interface Props {
  title: string;
  ProductSummary: ComponentType<{
    product: Product;
    actionOnClick: ActionOnClick;
  }>;
}

const Promotions = ({
  title,
  ProductSummary,
  children,
}: PropsWithChildren<Props>) => {
  const { promotions, loading, error } = usePromotions();

  if (loading) return <PromotionsSkeleton />;

  if (error || !promotions.length) return null;

  return (
    <PromotionTabList
      promotions={promotions}
      ProductSummary={ProductSummary}
      title={title}
    >
      {children}
    </PromotionTabList>
  );
};

export default Promotions;

Promotions.schema = {
  title: 'Promo section',
};
