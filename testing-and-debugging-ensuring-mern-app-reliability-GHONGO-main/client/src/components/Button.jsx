import React from 'react';

const variantToClass = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
};

const sizeToClass = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  onClick,
  ...rest
}) {
  const classes = [
    'btn',
    variantToClass[variant] || variantToClass.primary,
    sizeToClass[size] || sizeToClass.md,
    disabled ? 'btn-disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = (e) => {
    if (disabled) return;
    if (onClick) onClick(e);
  };

  return (
    <button type="button" className={classes} disabled={disabled} onClick={handleClick} {...rest}>
      {children}
    </button>
  );
}

