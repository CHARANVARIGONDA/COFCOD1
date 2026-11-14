import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'surface' | 'character';
  size?: 'normal' | 'small';
  fullWidth?: boolean;
  loading?: boolean;
  charAccent?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'normal',
  fullWidth = false,
  loading = false,
  charAccent,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const combinedClass = [
    styles.button,
    styles[variant],
    size === 'small' ? styles.small : '',
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const customStyle: React.CSSProperties = {
    ...style,
    ...(charAccent ? { '--char-accent-color': charAccent } as React.CSSProperties : {}),
  };

  return (
    <button
      className={combinedClass}
      disabled={disabled || loading}
      style={customStyle}
      {...props}
    >
      {loading ? <span>PROCESSING...</span> : children}
    </button>
  );
};
