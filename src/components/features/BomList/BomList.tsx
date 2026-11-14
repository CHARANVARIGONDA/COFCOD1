import React from 'react';
import type { BomItem } from '@cofoco/shared';
import { BomItemIcon } from '@cofoco/shared';
import styles from './BomList.module.css';

interface BomListProps {
  items: BomItem[];
}

export const BomList: React.FC<BomListProps> = ({ items }) => {
  return (
    <div className={styles.bomContainer}>
      <h3 className={styles.heading}>BILL OF MATERIALS (BOM) // COMPONENT AUDIT</h3>
      <div className={styles.list}>
        {items.map((item) => (
          <div key={item.id} className={styles.item}>
            <div className={styles.iconWrapper}>
              <BomItemIcon iconName={item.iconName} size={22} />
            </div>

            <div>
              <div className={styles.name}>{item.name}</div>
              <p className={styles.spec}>{item.spec}</p>
              <div className={styles.material}>Material: {item.material}</div>
            </div>

            <div className={styles.qtyBadge}>QTY: {item.qty}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
