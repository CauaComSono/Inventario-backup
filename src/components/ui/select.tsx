import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
  className?: string;
}

export function Select({ onValueChange, className = '', ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      onChange={(e) => onValueChange?.(e.target.value)}
    >
      {props.children}
    </select>
  );
}