// app/components/ui/container-account.tsx

import clsx from 'clsx';
import React from 'react';


interface ContainerProps<T extends React.ElementType = 'div'> {
  as?: T;
  className?: string;
  children: React.ReactNode;
}

export function Container<T extends React.ElementType = 'div'>({
  as,
  className,
  children,
  ...props
}: ContainerProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof ContainerProps<T>>) {
  const Component = as || 'div';

  return (
    <Component className={clsx('mx-auto max-w-7xl px-4 lg:px-4', className)} {...props}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </Component>
  );
}