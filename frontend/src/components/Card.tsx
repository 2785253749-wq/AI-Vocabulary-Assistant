import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: boolean;
}

export default function Card({ children, hover = false, padding = true, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100
        ${padding ? 'p-6' : ''}
        ${hover ? 'hover:shadow-md transition-shadow' : ''}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
