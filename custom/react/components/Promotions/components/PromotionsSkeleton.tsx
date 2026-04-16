import React from 'react';
import styles from '../styles.css';

export const PromotionsSkeleton = () => (
  <div className={styles.skeletonContainer}>
    <div className={styles.skeletonTabList}>
      {[1, 2, 3].map((i) => (
        <div key={i} className={styles.skeletonTab} />
      ))}
    </div>
    <div className={styles.skeletonGrid}>
      {[1, 2, 3, 4].map((i) => (
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
