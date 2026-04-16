import React from 'react';
import styles from '../styles.css';
import { useDevice } from 'vtex.device-detector';

export const PromotionTabSkeleton = () => {
  const { device } = useDevice();

  let cardCount = 2;
  if (device === 'desktop') cardCount = 4;
  else if (device === 'tablet') cardCount = 3;

  const cards = new Array(cardCount).fill(0);

  return (
    <div className={styles.tabSkeletonContainer}>
      <div className={styles.skeletonGrid}>
        {cards.map((_, i) => (
          <div key={i} className={styles.skeletonCard}>
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonLine} />
            <div className={styles.skeletonLineShort} />
            <div className={styles.skeletonPrice} />
          </div>
        ))}
      </div>
    </div>
  );
};
