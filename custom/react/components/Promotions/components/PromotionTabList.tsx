import React, { ComponentType, PropsWithChildren, useState } from 'react';
import type { Product } from 'vtex.product-context/react/ProductTypes';
import { index as RichText } from 'vtex.rich-text';
import { PromotionTab } from './PromotionTab';
import type { ActionOnClick } from './ProductSummaryList';
import type { ActivePromotion } from '../typings/promotions';
import styles from '../styles.css';

interface Props {
  title: string;
  promotions: ActivePromotion[];
  ProductSummary: ComponentType<{
    product: Product;
    actionOnClick: ActionOnClick;
  }>;
}

export const PromotionTabList = ({
  title,
  promotions,
  ProductSummary,
  children,
}: PropsWithChildren<Props>) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTexts}>
          {title && <RichText text={title} />}
        </div>

        <div className={styles.tabListWrapper}>
          <div className={styles.tabList} role="tablist">
            {promotions.map((promo, index) => (
              <button
                key={promo.id}
                role="tab"
                aria-selected={activeIndex === index}
                className={`${styles.tab} ${
                  activeIndex === index ? styles.tabActive : ''
                }`}
                onClick={() => setActiveIndex(index)}
              >
                {promo.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.tabPanel} role="tabpanel">
        {promotions.map((promo, index) => (
          <PromotionTab
            key={promo.id}
            promotion={promo}
            isActive={activeIndex === index}
            ProductSummary={ProductSummary}
          >
            {children}
          </PromotionTab>
        ))}
      </div>
    </div>
  );
};
