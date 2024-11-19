import React from 'react';

interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function Dialog({ children, open, onOpenChange, className = '' }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white rounded-lg shadow-lg ${className}`}>
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ children, className = '' }: DialogProps) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

export function DialogHeader({ children, className = '' }: DialogProps) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function DialogTitle({ children, className = '' }: DialogProps) {
  return (
    <h2 className={`text-xl font-bold ${className}`}>
      {children}
    </h2>
  );
}

export function DialogTrigger({ children }: DialogProps) {
  return <>{children}</>;
}