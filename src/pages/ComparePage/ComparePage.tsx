import React from 'react';
import { Link } from 'react-router-dom';
import { CompareMatrix } from '../../components/features/CompareMatrix/CompareMatrix';

export const ComparePage: React.FC = () => {

  return (
    <div style={{ paddingTop: 'clamp(100px, 12vw, 140px)', minHeight: '85vh' }}>
      <div className="container" style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.8125rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: 'var(--gold)',
            textTransform: 'uppercase',
          }}
        >
          ← BACK TO EQUIPMENT CATALOG
        </Link>
      </div>

      <CompareMatrix />
    </div>
  );
};
